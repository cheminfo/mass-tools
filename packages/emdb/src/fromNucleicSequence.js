'use strict';

const nucleotide = require('nucleotide');
const combineMFs = require('mf-generator');

/**
 * Add a database starting from a peptidic sequence
 *
 * @param {string} [sequence] Sequence as a string of 1 letter or 3 letters code. Could also be a correct molecular formula respecting uppercase, lowercase
 * @param {object} [options={}]
 * @param {string} [options.ionizations='']
 * @param {object} [options.info={}]
 * @param {string} [options.info.kind] - rna, ds-dna or dna. Default if contains U: rna, otherwise ds-dna
 * @param {string} [options.info.fivePrime=monophosphate] - alcohol, monophosphate, diphosphate, triphosphate
 * @param {string} [options.info.circular=false]
 * @param {array} [options.mfsArray=[]]
 * @param {object} [options.fragmentation={}] Object defining options for fragmentation
 * @param {boolean} [options.fragmentation.a=false] If true allow fragments of type 'a'
 * @param {boolean} [options.fragmentation.ab=false] If true allow fragments of type 'a' minus base
 * @param {boolean} [options.fragmentation.b=false] If true allow fragments of type 'b'
 * @param {boolean} [options.fragmentation.c=false] If true allow fragments of type 'c'
 * @param {boolean} [options.fragmentation.d=false] If true allow fragments of type 'd'
 * @param {boolean} [options.fragmentation.w=false] If true allow fragments of type 'w'
 * @param {boolean} [options.fragmentation.x=false] If true allow fragments of type 'x'
 * @param {boolean} [options.fragmentation.y=false] If true allow fragments of type 'y'
 * @param {boolean} [options.fragmentation.z=false] If true allow fragments of type 'z'
 *
 * @param {object} [options.filter={}] Object defining options for molecular formula filter
 * @param {number} [options.filter.minMass=0] - Minimal monoisotopic mass
 * @param {number} [options.filter.maxMass=+Infinity] - Maximal monoisotopic mass
 * @param {number} [options.filter.minEM=0] - Minimal neutral monoisotopic mass
 * @param {number} [options.filter.maxEM=+Infinity] - Maximal neutral monoisotopic mass
 * @param {number} [options.filter.minMSEM=0] - Minimal observed monoisotopic mass
 * @param {number} [options.filter.maxMSEM=+Infinity] - Maximal observed monoisotopic mass
 * @param {number} [options.filter.minCharge=-Infinity] - Minimal charge
 * @param {number} [options.filter.maxCharge=+Infinity] - Maximal charge
 * @param {number} [options.filter.unsaturation={}]
 * @param {number} [options.filter.unsaturation.min=-Infinity] - Minimal unsaturation
 * @param {number} [options.filter.unsaturation.max=+Infinity] - Maximal unsaturation
 * @param {number} [options.filter.unsaturation.onlyInteger=false] - Integer unsaturation
 * @param {number} [options.filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
 */

module.exports = function fromNucleicSequence(sequence, options = {}) {
  const {
    mfsArray = [],
    fragmentation = {},
    filter = {},
    ionizations = '',
    info = {}
  } = options;

  let sequences = nucleotide.sequenceToMF(sequence, info).split('.');

  let fragmentsArray = sequences.slice();

  // calculate fragmentation
  for (let i = 0; i < sequences.length; i++) {
    let sequence = sequences[i];
    var fragments = nucleotide.generateFragments(sequence, fragmentation);
    if (i === 1) {
      // complementary sequence
      fragments.forEach(fragment => fragment.replace(/\$/g, 'cmp-'));
    }
    fragmentsArray = fragmentsArray.concat(fragments);
  }

  mfsArray.push(fragmentsArray);

  let combined = combineMFs(mfsArray, {
    ionizations,
    filter: filter
  });

  return combined;
};
