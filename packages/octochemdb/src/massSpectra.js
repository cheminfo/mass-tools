

/**
 * This method will retrieve similar mass spectra
 * @param {object} [options={}]
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 * @param {number|string|number[]} [options.masses] - Observed monoisotopic mass
 * @param {number} [options.precision=1000] - Precision of the monoisotopic mass in ppm
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {string} [options.modifications=''] - Comma
 * @param {boolean} [options.uniqueMolecules=true] - If true, only one molecule per entry is returned
 * @param {object} [options.similarity={}]
 * @param {number} [options.similarity.nbPeaks=5] - Number of peaks to use for the similarity
 * @param {number} [options.similarity.massPower=1] - Power to use for the mass
 * @param {number} [options.similarity.minSimilarity=0.2] - Minimal similarity to return
 * @param {number} [options.similarity.intensityPower=0.6] - Power to use for the intensity
 * @param {number} [options.similarity.minNbCommonPeaks=0] - Minimal number of common peaks
 * @param {{x:number[],y:number[]}} [options.similarity.experimental=[]] - Experimental mass spectra to compare to
 *
 */

import { MSComparator } from 'ms-spectrum';

import { gnps } from "./gnps.js";
import { massBank } from "./massBank.js";


export async function massSpectra(options = {}) {
  const {
    uniqueMolecules = true,
  } = options;

  let results = (await Promise.all([gnps(options), massBank(options)])).flat();
  results = appendAndFilterSimilarity(results, options);
  if (uniqueMolecules) {
    results = uniqueMol(results);
  }
  return results;
}

function uniqueMol(results) {
  const unique = {};
  results.forEach((result) => {
    if (!unique[result.data.ocl.idCode]) {
      unique[result.data.ocl.idCode] = result;
    }
  });
  return Object.values(unique);
}

function appendAndFilterSimilarity(results, options = {}) {
  const { similarity } = options;
  if (!similarity || !similarity.experimental) return results;

  const { experimental,
    nbPeaks = 5,
    massPower = 1,
    minSimilarity = 0.2,
    intensityPower = 0.6,
    minNbCommonPeaks = 0,
  } = similarity;


  const precision = Number(options.precision) / 1e6;
  const comparator = new MSComparator({
    nbPeaks,
    massPower,
    intensityPower,
    delta: (mass) => mass * precision,
    minNbCommonPeaks,
  });
  for (const result of results) {
    result.similarity = comparator.getSimilarity(experimental, JSON.parse(JSON.stringify(result.data.spectrum.data)));
  }
  results = results.filter((a) => a.similarity >= minSimilarity);
  results.sort((a, b) => b.similarity - a.similarity);
  return results
}

