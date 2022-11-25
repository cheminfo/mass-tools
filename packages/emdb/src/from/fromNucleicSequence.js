import { groupsToSequence } from "chemical-groups";
import combineMFs from "mf-generator";
import nucleotide from "nucleotide";

/**
 * Add a database starting from a peptidic sequence
 *
 * @param {string} [sequencesString] Sequence as a string of 1 letter or 3 letters code. Could also be a correct molecular formula respecting uppercase, lowercase
 * @param {object} [options={}]
 * @param {boolean} [options.estimate=false] - estimate the number of MF without filters
 * @param {function} [options.onStep] - Callback to do after each step
 * @param {number} [options.limit=100000]
 * @param {string} [options.ionizations='']
 * @param {object} [options.info={}]
 * @param {string} [options.info.kind] - rna, ds-dna or dna. Default if contains U: rna, otherwise ds-dna
 * @param {string} [options.info.fivePrime=monophosphate] - alcohol, monophosphate, diphosphate, triphosphate
 * @param {string} [options.info.circular=false]
 * @param {array}   [options.mfsArray=[]]
 * @param {object}  [options.fragmentation={}] Object defining options for fragmentation
 * @param {boolean} [options.fragmentation.a=false] If true allow fragments of type 'a'
 * @param {boolean} [options.fragmentation.ab=false] If true allow fragments of type 'a' minus base
 * @param {boolean} [options.fragmentation.b=false] If true allow fragments of type 'b'
 * @param {boolean} [options.fragmentation.c=false] If true allow fragments of type 'c'
 * @param {boolean} [options.fragmentation.d=false] If true allow fragments of type 'd'
 * @param {boolean} [options.fragmentation.dh2o=false] If true allow fragments of type 'd' with water loss
 * @param {boolean} [options.fragmentation.w=false] If true allow fragments of type 'w'
 * @param {boolean} [options.fragmentation.x=false] If true allow fragments of type 'x'
 * @param {boolean} [options.fragmentation.y=false] If true allow fragments of type 'y'
 * @param {boolean} [options.fragmentation.z=false] If true allow fragments of type 'z'
 * @param {boolean} [options.baseLoss=false] If true allow base loss at all the positions
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
 * @param {object} [options.filter.unsaturation={}]
 * @param {number} [options.filter.unsaturation.min=-Infinity] - Minimal unsaturation
 * @param {number} [options.filter.unsaturation.max=+Infinity] - Maximal unsaturation
 * @param {boolean} [options.filter.unsaturation.onlyInteger=false] - Integer unsaturation
 * @param {boolean} [options.filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
 * @returns {Promise}
 */

module.exports = async function fromNucleicSequence(
  sequencesString,
  options = {},
) {
  const {
    mfsArray = [],
    fragmentation = {},
    filter = {},
    ionizations = '',
    info = {},
    estimate = false,
    limit = 100000,
    onStep,
  } = options;

  let sequences = nucleotide.sequenceToMF(sequencesString, info).split('.');
  let fragmentsArray = sequences.slice();

  // calculate fragmentation
  for (let i = 0; i < sequences.length; i++) {
    let sequence = sequences[i];
    let fragments = nucleotide.generateFragments(sequence, fragmentation);
    if (i === 1) {
      // complementary sequence
      fragments = fragments.map((fragment) => fragment.replace(/\$/g, '$cmp-'));
    }
    fragmentsArray = fragmentsArray.concat(fragments);
    if (fragmentation.baseLoss) {
      fragmentsArray = fragmentsArray.concat(nucleotide.baseLoss(sequence));
    }
  }

  mfsArray.push(fragmentsArray);

  let combined = await combineMFs(mfsArray, {
    ionizations,
    filter,
    uniqueMFs: false,
    estimate,
    onStep,
    limit,
  });

  if (Array.isArray(combined)) {
    // not an estimation
    combined.forEach((result) => {
      result.sequence = groupsToSequence(
        result.parts.filter((part) => part).join(' '),
      );
    });
  }

  return combined;
};
