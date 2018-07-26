'use strict';

/**
 * Convert a nucleic sequence to a MF
 * @param {String} sequence
 * @param {object} [options={}]
 * @param {string} [options.kind] - rna, ds-dna or dna. Default if contains U: rna, otherwise ds-dna
 * @param {string} [options.circular=false]
 */

function sequenceToMF(sequence, options = {}) {
    let { kind, circular } = options;
    sequence = sequence.toUpperCase().replace(/[^ATCGU]/g, '');
    if (!kind) {
        if (sequence.includes('U')) {
            kind = 'rna';
        } else {
            kind = 'ds-dna';
        }
    }

    kind = kind.replace(/[^A-Za-z]/g, '').toLowerCase();

    let results = [[]];
    if (kind === 'dsdna') results.push([]);

    switch (kind) {
        case 'dna':
            for (let nucleotide of sequence) {
                results[0].push(desoxyNucleotides[nucleotide]);
            }
            break;
        case 'rna':
            for (let nucleotide of sequence) {
                results[0].push(oxyNucleotides[nucleotide]);
            }
            break;
        case 'dsdna':
            for (let nucleotide of sequence) {
                results[0].push(oxyNucleotides[nucleotide]);
                results[1].unshift(oxyNucleotides[complementary[nucleotide]]);
            }
            break;
        default:
            throw new Error(`Nucleotide sequenceToMF: unknown kind: ${kind}`);
    }

    if (!circular) {
        results.forEach((result) => result.unshift('HO'));
        results.forEach((result) => result.push('H'));
    }

    return results.map((result) => result.join('')).join('.');
}

module.exports = {
    sequenceToMF
};

const complementary = {
    A: 'T',
    T: 'A',
    C: 'G',
    G: 'C'
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
