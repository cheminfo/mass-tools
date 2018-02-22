'use strict';

const peptide = require('peptide');
const combineMFs = require('mf-generator');

/**
 * Add a database starting from a peptidic sequence
 *
 * {string} [sequence] Sequence as a string of 1 letter or 3 letters code. Could also be a correct molecular formula respecting uppercase, lowercase
 * {object} [options.digestion={}] Object defining options for digestion
 * {number} [options.digestion.minMissed=0] Minimal number of allowed missed cleavage
 * {number} [options.digestion.maxMissed=0] Maximal number of allowed missed cleavage
 * {number} [options.digestion.minResidue=0] Minimal number of residues
 * {number} [options.digestion.maxResidue=Infinity] Maximal number of residues
 * {string} [options.digestion.enzyme] Mandatory field containing the name of the enzyme among: chymotrypsin, trypsin, glucph4, glucph8, thermolysin, cyanogenbromide
 *
 * {object} [options.fragmentation={}] Object defining options for fragmentation
 * {boolean} [options.fragmentation.a=false] If true allow fragments of type 'a'
 * {boolean} [options.fragmentation.b=false] If true allow fragments of type 'b'
 * {boolean} [options.fragmentation.c=false] If true allow fragments of type 'c'
 * {boolean} [options.fragmentation.x=false] If true allow fragments of type 'x'
 * {boolean} [options.fragmentation.y=false] If true allow fragments of type 'y'
 * {boolean} [options.fragmentation.z=false] If true allow fragments of type 'z'
 * {boolean} [options.fragmentation.ya=false] If true allow fragments of type 'ya'
 * {boolean} [options.fragmentation.yb=false] If true allow fragments of type 'yb'
 * {boolean} [options.fragmentation.yc=false] If true allow fragments of type 'yc'
 * {boolean} [options.fragmentation.zc=false] If true allow fragments of type 'zc'
 * {number} [options.fragmentation.minInternal=0] Minimal internal fragment length
 * {number} [options.fragmentation.maxInternal=Infinity] Maximal internal fragment length
 *
 * {object} [options.mfFilter={}] Object defining options for molecular formula filter
 */


module.exports = function fromPeptidicSequence(sequence, options = {}) {
    const {
        digestion = {},
        mfsArray = [],
        allowNeutralLoss = false,
        protonation = false,
        protonationPH = 7,
        fragmentation = {},
        mfFilter = {}
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

    let combined = combineMFs(mfsArray, mfFilter);

    return combined;
};

