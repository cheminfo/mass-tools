import { groupsToSequence } from 'chemical-groups';
import { generateMFs } from 'mf-generator';

import { fragmentPeptide } from './util/fragmentPeptide';

/**
 * Add a database starting from a peptidic sequence
 *
 * @param {string}         [sequences] Sequence as a string of 1 letter or 3 letters code. Could also be a correct molecular formula respecting uppercase, lowercase. It can be comma separated if you have many peptide sequences
 * @param {object}         [options={}]
 * @param {boolean}        [options.estimate=false] - estimate the number of MF without filters
 * @param {string}         [options.ionizations='']
 * @param {function}       [options.onStep] - Callback to do after each step
 * @param {array}          [options.mfsArray=[]]
 * @param {boolean}        [options.protonation=false]
 * @param {number}         [options.protonationPH=7]
 * @param {boolean}        [options.allowNeutralLoss=false]
 * @param {number}         [options.limit=100000]
 *
 * @param {object}         [options.digestion={}] Object defining options for digestion
 * @param {number}         [options.digestion.minMissed=0] Minimal number of allowed missed cleavage
 * @param {number}         [options.digestion.maxMissed=0] Maximal number of allowed missed cleavage
 * @param {number}         [options.digestion.minResidue=0] Minimal number of residues
 * @param {number}         [options.digestion.maxResidue=+Infinity] Maximal number of residues
 * @param {string}         [options.digestion.enzyme] Mandatory field containing the name of the enzyme among: chymotrypsin, trypsin, glucph4, glucph8, thermolysin, cyanogenbromide
 *
 * @param {object}         [options.fragmentation={}] Object defining options for fragmentation
 * @param {boolean}        [options.fragmentation.a=false] If true allow fragments of type 'a'
 * @param {boolean}        [options.fragmentation.b=false] If true allow fragments of type 'b'
 * @param {boolean}        [options.fragmentation.c=false] If true allow fragments of type 'c'
 * @param {boolean}        [options.fragmentation.x=false] If true allow fragments of type 'x'
 * @param {boolean}        [options.fragmentation.y=false] If true allow fragments of type 'y'
 * @param {boolean}        [options.fragmentation.z=false] If true allow fragments of type 'z'
 * @param {boolean}        [options.fragmentation.ya=false] If true allow fragments of type 'ya'
 * @param {boolean}        [options.fragmentation.yb=false] If true allow fragments of type 'yb'
 * @param {boolean}        [options.fragmentation.yc=false] If true allow fragments of type 'yc'
 * @param {boolean}        [options.fragmentation.zc=false] If true allow fragments of type 'zc'
 * @param {number}         [options.fragmentation.minInternal=0] Minimal internal fragment length
 * @param {number}         [options.fragmentation.maxInternal=+Infinity] Maximal internal fragment length
 *
 * @param {object}         [options.filter={}] Object defining options for molecular formula filter
 * @param {number}         [options.filter.precision=1000] - The precision on the experimental mass
 * @param {number}         [options.filter.targetMass] - Target mass, allows to calculate error and filter results
 * @param {number[]}       [options.filter.targetMasses] - Target masses: SORTED array of numbers
 * @param {number[]}       [options.filter.targetIntensities] - Target intensities: SORTED array of numbers
 * @param {number}         [options.filter.minEM=0] - Minimal neutral monoisotopic mass
 * @param {number}         [options.filter.maxEM=+Infinity] - Maximal neutral monoisotopic mass
 * @param {number}         [options.filter.minMSEM=0] - Minimal observed monoisotopic mass
 * @param {number}         [options.filter.maxMSEM=+Infinity] - Maximal observed monoisotopic mass
 * @param {number}         [options.filter.minCharge=-Infinity] - Minimal charge
 * @param {number}         [options.filter.maxCharge=+Infinity] - Maximal charge
 * @param {object}         [options.filter.unsaturation={}]
 * @param {number}         [options.filter.unsaturation.min=-Infinity] - Minimal unsaturation
 * @param {number}         [options.filter.unsaturation.max=+Infinity] - Maximal unsaturation
 * @param {boolean}         [options.filter.unsaturation.onlyInteger=false] - Integer unsaturation
 * @param {boolean}         [options.filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
 * @param {function}       [options.filter.callback] - a function to filter the MF
 * @returns {Promise}
 */

export async function fromPeptidicSequence(sequences, options = {}) {
  const {
    digestion = {},
    mfsArray: originalMFsArray = [],
    allowNeutralLoss = false,
    protonation = false,
    protonationPH = 7,
    fragmentation = {},
    filter = {},
    ionizations = '',
    limit = 100000,
    estimate = false,
    onStep,
    links = {},
  } = options;

  const hasLinked = sequences.includes('#');
  const mfsArrayLinked = JSON.parse(JSON.stringify(originalMFsArray));
  const mfsArrayUnlinked = JSON.parse(JSON.stringify(originalMFsArray));
  const unlinked = [];
  mfsArrayUnlinked.push(unlinked);

  for (const sequence of sequences.split(/[,:]/)) {
    let fragmentsArray = fragmentPeptide(sequence, {
      digestion,
      protonation,
      fragmentation,
      protonationPH,
      allowNeutralLoss,
    });
    mfsArrayLinked.push(
      fragmentsArray.filter((fragment) => fragment.includes('#')),
    );
    unlinked.push(
      ...fragmentsArray.filter((fragment) => !fragment.includes('#')),
    );
  }

  let combined = await generateMFs(mfsArrayUnlinked, {
    ionizations,
    filter,
    estimate,
    limit,
    onStep,
    links,
  });

  if (hasLinked) {
    combined.push(
      ...(await generateMFs(mfsArrayLinked, {
        ionizations,
        filter,
        estimate,
        limit,
        onStep,
        links,
      })),
    );
  }

  if (!estimate) {
    combined.forEach((result) => {
      result.sequence = groupsToSequence(
        result.parts.filter((part) => part).join(' '),
      );
    });
  }

  return combined;
}
