'use strict';

function sequenceToMF(sequence, options = {}) {
    let { dna, rna, circular } = options;
    sequence = sequence.toUpperCase().replace(/[^ATCGU]/g, '');
    if (!dna && !rna) {
        if (sequence.includes('U')) {
            rna = true;
        } else {
            dna = true;
        }
    }
    var nucleotides;
    if (dna) {
        nucleotides = desoxyNucleotides;
    } else {
        nucleotides = oxyNucleotides;
    }

    let result = [];
    if (!circular) result.push('HO');
    for (let nucleotide of sequence) {
        result.push(nucleotides[nucleotide]);
    }
    if (!circular) result.push('H');
    return result.join('');
}

module.exports = {
    sequenceToMF
};

const desoxyNucleotides = {
    A: 'Damp',
    C: 'Dcmp',
    G: 'Dgmp',
    T: 'Dtmp',
    U: 'Dump'
};

const oxyNucleotides = {
    A: 'Amp',
    C: 'Cmp',
    G: 'Gmp',
    T: 'Tmp',
    U: 'Ump'
};
