import { Comparator } from 'peaks-similarity';

/**
 * @param {object}   [options={}]
 * @param {object}   [options.minCharge=1]
 * @param {object}   [options.maxCharge=10]
 * @param {object}   [options.similarity={}]
 * @param {object}   [options.similarity.widthBottom]
 * @param {object}   [options.similarity.widthTop]
 * @param {object}   [options.similarity.widthFunction] - function called with mass that should return an object width containing top and bottom
 * @param {object}   [options.similarity.zone={}]
 * @param {object}   [options.similarity.zone.low=-0.5] - window shift based on observed monoisotopic mass
 * @param {object}   [options.similarity.zone.high=2.5] - to value for the comparison window
 * @param {object}   [options.similarity.common]
 */

const NEUTRON_MASS = 1;

export function getPeakChargeBySimilarity(spectrum, targetMass, options = {}) {
  let { similarity = {}, minCharge = 1, maxCharge = 10 } = options;
  let { zone = {}, widthFunction } = similarity;
  let { low = -0.5, high = 2.5 } = zone;

  if (!spectrum || !spectrum.data.x.length > 0) {
    throw Error(
      'You need to add an experimental spectrum first using setMassSpectrum',
    );
  }

  let width = {
    bottom: similarity.widthBottom,
    top: similarity.widthTop,
  };

  similarity = JSON.parse(JSON.stringify(similarity));
  similarity.common = 'second';

  let experimentalData = spectrum.data;
  let similarityProcessor = new Comparator(similarity);
  similarityProcessor.setPeaks1([experimentalData.x, experimentalData.y]);

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

  let fromCharge =
    minCharge * maxCharge > 0
      ? Math.round(Math.min(Math.abs(minCharge), Math.abs(maxCharge)))
      : 1;
  let toCharge = Math.round(Math.max(Math.abs(minCharge), Math.abs(maxCharge)));

  let fromIsotope = Math.ceil(low);
  let toIsotope = Math.floor(high);
  let isotopeHeight = 1 / (toIsotope - fromIsotope + 1);

  let results = [];

  for (let charge = fromCharge; charge < toCharge + 1; charge++) {
    let isotopePositions = { x: [], y: [] };
    for (
      let isotopePosition = fromIsotope;
      isotopePosition < toIsotope + 1;
      isotopePosition++
    ) {
      isotopePositions.x.push(
        targetMass + (isotopePosition * NEUTRON_MASS) / charge,
      );
      isotopePositions.y.push(isotopeHeight);
    }
    let from = targetMass + low / Math.abs(charge);
    let to = targetMass + high / Math.abs(charge);
    similarityProcessor.setFromTo(from, to);
    if (widthFunction) {
      width = widthFunction(targetMass);
      similarityProcessor.setTrapezoid(width.bottom, width.top);
    }

    similarityProcessor.setPeaks2([isotopePositions.x, isotopePositions.y]);
    let result = similarityProcessor.getSimilarity();

    results.push({ charge, similarity: result.similarity });
  }

  return results.sort((a, b) => b.similarity - a.similarity)[0].charge;
}
