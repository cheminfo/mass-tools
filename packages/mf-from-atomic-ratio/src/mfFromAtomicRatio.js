import { generateMFs } from 'mf-generator';
import { MF } from 'mf-parser';

/**
 * @typedef {object} AtomicRatioMF
 * @property {number} em
 * @property {number} mw
 * @property {string} mf
 * @property {Array<MFAtomicComposition>} mfAtomicComposition
 * @property {Array<AtomicRatio>} atomicRatios
 * @property {number} totalError
 */

/**
 * @typedef {object} MFAtomicComposition
 * @property {string} element
 * @property {number} count
 * @property {number} theoretical
 * @property {number} experimental
 * @property {number} error
 */

/**
 * @typedef {object} AtomicRatio
 * @property {string} element
 * @property {number} count
 * @property {number} theoretical
 */

/**
 * Returns possible combinations
 * @param {object} [ratios]
 * @param {object} [options={}]
 * @param {string} [options.ranges='C0-10 H0-10 O0-10 N0-10'] - range of mfs to search
 * @param {number} [options.maxElementError=0.05]
 * @param {number} [options.maxTotalError=0.1]
 * @param {number} [options.minMW=0] minimal molecular weight
 * @param {number} [options.maxMW=+Infinity] maximal molecular weight
 * @param {object} [options.unsaturation={}]
 * @param {number} [options.unsaturation.min=-Infinity] Minimal unsaturation
 * @param {number} [options.unsaturation.max=+Infinity] Maximal unsaturation
 * @param {boolean} [options.unsaturation.onlyInteger=false] Integer unsaturation
 * @param {boolean} [options.unsaturation.onlyNonInteger=false] Non integer unsaturation
 * @return {Promise<AtomicRatioMF[]>}
 */

export async function mfFromAtomicRatio(ratios, options = {}) {
  const {
    unsaturation = {},
    minMW = 0,
    maxMW = +Infinity,
    ranges = 'C0-10 H0-10 O0-10 N0-10',
    maxElementError = 0.05,
    maxTotalError = 0.1,
  } = options;

  const elements = Object.keys(ratios);

  const mfs = await generateMFs([ranges], {
    limit: 1e7,
    filter: {
      minMW,
      maxMW,
      unsaturation,
    },
  });

  let sumComposition = 0;
  for (const element of elements) {
    sumComposition += ratios[element];
  }

  const relativeComposition = {};
  for (const element of elements) {
    relativeComposition[element] = ratios[element] / sumComposition;
  }

  for (const mf of mfs) {
    appendInfo(mf, elements);
  }

  const filteredMFs = [];
  mfFor: for (const mf of mfs) {
    if (mf.nbCompositionAtoms === 0) {
      continue;
    }
    mf.totalError = 0;
    const atomicRatios = [];
    for (const element of elements) {
      const error = mf.atomicRatio[element] - relativeComposition[element];
      let absError = Math.abs(error);
      if (absError > maxElementError) {
        continue mfFor;
      }
      mf.totalError += absError;
      atomicRatios.push({
        element,
        experimental: mf.atomicRatio[element],
        count: mf.atoms[element] || 0,
        theoretical: relativeComposition[element],
        error,
      });
    }
    if (mf.totalError > maxTotalError) {
      continue;
    }
    filteredMFs.push({
      em: mf.em,
      mw: mf.mw,
      mf: mf.mf,
      mfAtomicComposition: getMFAtomicComposition(mf.atoms),
      atomicRatios,
      totalError: mf.totalError,
    });
  }
  filteredMFs.sort((a, b) => Math.abs(a.totalError) - Math.abs(b.totalError));
  return filteredMFs;
}

function getMFAtomicComposition(atoms) {
  const nbAtoms = Object.values(atoms).reduce((acc, val) => acc + val, 0);
  const composition = [];
  for (const [element, count] of Object.entries(atoms)) {
    composition.push({
      element,
      count,
      theoretical: count / nbAtoms,
    });
  }
  return composition;
}

function appendInfo(mf, elements) {
  const mfInfo = new MF(mf.mf).getInfo();
  let nbCompositionAtoms = 0;
  for (const element of elements) {
    nbCompositionAtoms += mfInfo.atoms[element] || 0;
  }
  mf.nbCompositionAtoms = nbCompositionAtoms;
  mf.atomicRatio = {};
  for (const element of elements) {
    mf.atomicRatio[element] = (mfInfo.atoms[element] || 0) / nbCompositionAtoms;
  }
}
