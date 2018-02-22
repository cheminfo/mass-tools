'use strict';

const peptide = require('peptide');
const combineMFs = require('mf-generator');

/**
 * Add a database starting from a peptidic sequence
 *
 * @param {object} [options.digestion={}] Object defining options for digestion
 * @param {string} [sequence] Sequence as a string of 1 letter or 3 letters code. Could also be a correct molecular formula respecting uppercase, lowercase
 * @param {number} [options.digestion.minMissed=0] Minimal number of allowed missed cleavage
 * @param {number} [options.digestion.maxMissed=0] Maximal number of allowed missed cleavage
 * @param {number} [options.digestion.minResidue=0] Minimal number of residues
 * @param {number} [options.digestion.maxResidue=+Infinity] Maximal number of residues
 * @param {string} [options.digestion.enzyme] Mandatory field containing the name of the enzyme among: chymotrypsin, trypsin, glucph4, glucph8, thermolysin, cyanogenbromide
 *
 * @param {object} [options.fragmentation={}] Object defining options for fragmentation
 * @param {boolean} [options.fragmentation.a=false] If true allow fragments of type 'a'
 * @param {boolean} [options.fragmentation.b=false] If true allow fragments of type 'b'
 * @param {boolean} [options.fragmentation.c=false] If true allow fragments of type 'c'
 * @param {boolean} [options.fragmentation.x=false] If true allow fragments of type 'x'
 * @param {boolean} [options.fragmentation.y=false] If true allow fragments of type 'y'
 * @param {boolean} [options.fragmentation.z=false] If true allow fragments of type 'z'
 * @param {boolean} [options.fragmentation.ya=false] If true allow fragments of type 'ya'
 * @param {boolean} [options.fragmentation.yb=false] If true allow fragments of type 'yb'
 * @param {boolean} [options.fragmentation.yc=false] If true allow fragments of type 'yc'
 * @param {boolean} [options.fragmentation.zc=false] If true allow fragments of type 'zc'
 * @param {number} [options.fragmentation.minInternal=0] Minimal internal fragment length
 * @param {number} [options.fragmentation.maxInternal=+Infinity] Maximal internal fragment length
 *
 * @param {object} [options.mfFilter={}] Object defining options for molecular formula filter
 * @param {number} [options.mfFilter.minMass=0] - Minimal monoisotopic mass
 * @param {number} [options.mfFilter.maxMass=+Infinity] - Maximal monoisotopic mass
 * @param {number} [options.mfFilter.minEM=0] - Minimal neutral monoisotopic mass
 * @param {number} [options.mfFilter.maxEM=+Infinity] - Maximal neutral monoisotopic mass
 * @param {number} [options.mfFilter.minMSEM=0] - Minimal observed monoisotopic mass
 * @param {number} [options.mfFilter.maxMSEM=+Infinity] - Maximal observed monoisotopic mass
 * @param {number} [options.mfFilter.minCharge=-Infinity] - Minimal charge
 * @param {number} [options.mfFilter.maxCharge=+Infinity] - Maximal charge
 * @param {number} [options.mfFilter.minUnsaturation=-Infinity] - Minimal unsaturation
 * @param {number} [options.mfFilter.maxUnsaturation=+Infinity] - Maximal unsaturation
 * @param {number} [options.mfFilter.onlyIntegerUnsaturation=false] - Integer unsaturation
 * @param {number} [options.mfFilter.onlyNonIntegerUnsaturation=false] - Non
 */


module.exports = function fromPeptidicSequence(sequence, options = {}) {
    const {
        digestion = {},
        mfsArray = [],
        allowNeutralLoss = false,
        protonation = false,
        protonationPH = 7,
        fragmentation = {},
        mfFilter = {},
        ionizations = '',
    } = options;

    sequence = peptide.convertAASequence(sequence);

    let fragmentsArray = [sequence];
    // do we also have some digest fragments ?
    if (digestion.enzyme) {
        var digests = peptide.digestPeptide(sequence, digestion);
        if (options.protonation) {
            digests = peptide.chargePeptide(digests, { pH: options.protonationPH });
        }
        fragmentsArray = fragmentsArray.concat(digests);
    }

    // allow neutral loss
    if (allowNeutralLoss) {
        sequence = peptide.allowNeutralLoss(sequence);
    }

    // apply protonation
    if (protonation) {
        sequence = peptide.chargePeptide(sequence, { pH: protonationPH });
    }

    // calculate fragmentation
    var fragments = peptide.generatePeptideFragments(sequence, fragmentation);
    fragmentsArray = fragmentsArray.concat(fragments);

    mfsArray.push(fragmentsArray);


    let combined = combineMFs(mfsArray, {
        ionizations,
        filter: mfFilter
    });

    return combined;
};

