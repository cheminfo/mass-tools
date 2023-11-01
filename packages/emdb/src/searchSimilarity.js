import { IsotopicDistribution } from 'isotopic-distribution';
import { Comparator } from 'peaks-similarity';
/**
Search for an experimental monoisotopic mass and calculate the similarity
* @param {object}   [options={}]
* @param {array}    [options.databases] - an array containing the name of the databases so search, by default all
* @param {boolean}  [options.flatten] - should we return the array as a flat result
* @param {function} [options.onStep] - Callback to do after each step
* @param {string}   [options.ionizations=''] - Comma separated list of ionizations (to charge the molecule)
* @param {object}   [options.minSimilarity=0.5] - min similarity value

* @param {object}   [options.filter={}]
* @param {boolean}  [options.filter.forceIonization=false] - If true ignore existing ionizations
* @param {number}   [options.filter.msem] - Observed monoisotopic mass in mass spectrometer
* @param {number}   [options.filter.precision=1000] - The precision on the experimental mass
* @param {number}   [options.filter.minCharge=-Infinity] - Minimal charge
* @param {number}   [options.filter.maxCharge=+Infinity] - Maximal charge
* @param {boolean}  [options.filter.absoluteCharge=false] - If true, the charge is absolute (so between 0 and +Infinity by default)
* @param {object}   [options.filter.unsaturation={}]
* @param {number}   [options.filter.unsaturation.min=-Infinity] - Minimal unsaturation
* @param {number}   [options.filter.unsaturation.max=+Infinity] - Maximal unsaturation
* @param {boolean}  [options.filter.unsaturation.onlyInteger=false] - Integer unsaturation
* @param {boolean}  [options.filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
* @param {object}   [options.filter.atoms] - object of atom:{min, max}
* @param {object}   [options.filter.callback] - a function to filter the MF
* @param {object}   [options.similarity={}]
* @param {number}   [options.similarity.widthBottom]
* @param {number}   [options.similarity.widthTop]
* @param {object}   [options.similarity.widthFunction] - function called with mass that should return an object width containing top and bottom
* @param {object}   [options.similarity.zone={}]
* @param {number}   [options.similarity.zone.low=-0.5] - window shift based on observed monoisotopic mass
* @param {number}   [options.similarity.zone.high=2.5] - to value for the comparison window
* @param {boolean}  [options.similarity.zone.auto=false] - if true, low / high is determined based on the isotopic distribution and the threshold
* @param {string}   [options.similarity.common]
* @param {number}   [options.similarity.threshold=0.001] - when calculating similarity we only use the isotopic distribution with peaks over this relative threshold
* @param {number}   [options.similarity.limit] - We may define the maximum number of peaks to keep
* @returns {Promise}
*/

export async function searchSimilarity(emdb, options = {}) {
  const { similarity = {}, minSimilarity = 0.5, filter = {}, onStep } = options;

  let width = {
    bottom: similarity.widthBottom,
    top: similarity.widthTop,
  };

  if (
    !emdb.experimentalSpectrum ||
    !emdb.experimentalSpectrum.data.x.length > 0
  ) {
    throw Error(
      'You need to add an experimental spectrum first using setMassSpectrum',
    );
  }

  let experimentalData = emdb.experimentalSpectrum.data;
  let sumY = emdb.experimentalSpectrum.sumY();

  // the result of emdb query will be stored in a property 'ms'

  let results = emdb.searchMSEM(filter.msem, options);
  let flatEntries = [];
  if (!options.flatten) {
    for (let database of Object.keys(results)) {
      for (let entry of results[database]) {
        flatEntries.push(entry);
      }
    }
  } else {
    flatEntries = results;
  }
  let { widthFunction, zone = {}, threshold = 0.001, limit } = similarity;

  if (widthFunction && typeof widthFunction === 'string') {
    // eslint-disable-next-line no-new-func
    widthFunction = new Function('mass', widthFunction);
    let checkTopBottom = widthFunction(123);
    if (!checkTopBottom.bottom || !checkTopBottom.top) {
      throw Error(
        'widthFunction should return an object with bottom and top properties',
      );
    }
  }

  const { low = -0.5, high = 2.5, auto } = zone;

  // we need to calculate the similarity of the isotopic distribution
  let similarityProcessor = new Comparator(similarity);
  similarityProcessor.setPeaks1([experimentalData.x, experimentalData.y]);

  for (let i = 0; i < flatEntries.length; i++) {
    const entry = flatEntries[i];
    if (onStep) await onStep(i);

    if (widthFunction) {
      width = widthFunction(entry.ms.em);
    }

    let isotopicDistribution = new IsotopicDistribution(entry.mf, {
      allowNeutral: false,
      ionizations: [entry.ionization],
      fwhm: width.top / 2,
      threshold,
      limit,
    });

    let distribution = isotopicDistribution.getDistribution();
    // we need to define the comparison zone that depends of the charge
    let from, to;
    if (auto) {
      from = distribution.minX - 0.5;
      to = distribution.maxX + 0.5;
      similarityProcessor.setFromTo(from, to);
    } else {
      from = entry.ms.em + low / Math.abs(entry.ms.charge);
      to = entry.ms.em + high / Math.abs(entry.ms.charge);
      similarityProcessor.setFromTo(from, to);
    }

    if (widthFunction) {
      similarityProcessor.setTrapezoid(width.bottom, width.top);
    }
    similarityProcessor.setPeaks2([distribution.xs, distribution.ys]);
    let result = similarityProcessor.getSimilarity();

    result.extractInfo1.from = from;
    result.extractInfo1.to = to;

    if (result.similarity > minSimilarity) {
      entry.ms.similarity = {
        value: result.similarity,
        experimental: result.extract1,
        theoretical: result.extract2,
        difference: result.diff,
        experimentalInfo: result.extractInfo1,
        thereoticalInfo: result.extractInfo2,
        quantity: result.extractInfo1.sum / sumY,
        factor: result.extractInfo1.max / result.extractInfo2.max, // by how much we should mulitply the extrat2 to reach the spectrum
        width,
      };
    }
  }

  if (!options.flatten) {
    for (let database of Object.keys(results)) {
      results[database] = results[database]
        .filter((entry) => entry.ms.similarity)
        .sort((a, b) => b.ms.similarity.value - a.ms.similarity.value);
      for (let entry of results[database]) {
        flatEntries.push(entry);
      }
    }
  } else {
    results = results
      .filter((entry) => entry.ms.similarity)
      .sort((a, b) => b.ms.similarity.value - a.ms.similarity.value);
  }

  return results;
}
