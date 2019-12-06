'use strict';

/**
 * Convert a nucleic sequence to a MF
 * @param {String} sequence
 * @param {object} [options={}]
 * @param {string} [options.kind] - rna, ds-dna or dna. Default if contains U: rna, otherwise ds-dna
 * @param {string} [options.fivePrime=monophosphate] - alcohol, monophosphate, diphosphate, triphosphate
 * @param {string} [options.circular=false]
 */

function sequenceToMF(sequence, options = {}) {
  let fivePrimeTerminal = 'HO';
  let threePrimeTerminal = 'H';
  sequence = sequence.trim();

  if (sequence === '') return '';
  let { kind, circular, fivePrime = 'monophosphate' } = options;
  fivePrime = fivePrime.replace(/[^a-zA-Z]/g, '').toLowerCase();

  if (!kind) {
    if (sequence.includes('U')) {
      kind = 'rna';
    } else {
      kind = 'ds-dna';
    }
  }

  kind = kind.replace(/[^A-Za-z]/g, '').toLowerCase();

  if (sequence.includes('(') && kind === 'dsdna') {
    throw new Error(
      'Nucleotide sequenceToMF: modifications not allowed for ds-DNA',
    );
  }

  let results = [[]];
  if (kind === 'dsdna') results.push([]);

  let parenthesisCounter = 0;

  for (let i = 0; i < sequence.length; i++) {
    let currentSymbol = sequence[i];

    if (
      currentSymbol === '(' ||
      currentSymbol === ')' ||
      parenthesisCounter > 0
    ) {
      if (currentSymbol === '(') {
        parenthesisCounter++;
        if (i === 0) fivePrimeTerminal = '';
      }
      if (currentSymbol === ')') {
        parenthesisCounter--;
        if (i === sequence.length - 1) threePrimeTerminal = '';
      }
      switch (kind) {
        case 'dna':
        case 'rna':
          results[0].push(currentSymbol);
          break;
        default:
          // eslint-disable-next-line no-console
          console.warn(
            `Nucleotide sequenceToMF with modification: unknown kind: ${kind}`,
          );
      }
      continue;
    }

    let nucleotideType = i === 0 ? fivePrime : 'monophosphate';

    currentSymbol = currentSymbol.toUpperCase().replace(/[^ATCGU]/, '');
    if (!currentSymbol) continue;

    switch (kind) {
      case 'dna':
        results[0].push(desoxyNucleotides[nucleotideType][currentSymbol]);
        break;
      case 'rna':
        results[0].push(oxyNucleotides[nucleotideType][currentSymbol]);
        break;
      case 'dsdna':
        results[0].push(desoxyNucleotides[nucleotideType][currentSymbol]);
        results[1].unshift(
          desoxyNucleotides[nucleotideType][complementary[currentSymbol]],
        );
        break;
      default:
        // eslint-disable-next-line no-console
        console.warn(`Nucleotide sequenceToMF: unknown kind: ${kind}`);
    }
  }

  if (!circular) {
    results.forEach((result) => result.unshift(fivePrimeTerminal));
    results.forEach((result) => result.push(threePrimeTerminal));
  }

  return results.map((result) => result.join('')).join('.');
}

module.exports = {
  sequenceToMF,
  generateFragments: require('./generateFragments'),
  furanThreeTerm: require('./furanThreeTerm'),
  baseLoss: require('./baseLoss'),
};

const complementary = {
  A: 'T',
  T: 'A',
  C: 'G',
  G: 'C',
};

const desoxyNucleotides = {
  alcohol: {
    A: 'Dade',
    C: 'Dcyt',
    G: 'Dgua',
    T: 'Dthy',
    U: 'Dura',
  },
  monophosphate: {
    A: 'Damp',
    C: 'Dcmp',
    G: 'Dgmp',
    T: 'Dtmp',
    U: 'Dump',
  },
  diphosphate: {
    A: 'Dadp',
    C: 'Dcdp',
    G: 'Dgdp',
    T: 'Dtdp',
    U: 'Dudp',
  },
  triphosphate: {
    A: 'Datp',
    C: 'Dctp',
    G: 'Dgtp',
    T: 'Dttp',
    U: 'Dutp',
  },
};

const oxyNucleotides = {
  alcohol: {
    A: 'Ade',
    C: 'Cyt',
    G: 'Gua',
    T: 'Thy',
    U: 'Ura',
  },
  monophosphate: {
    A: 'Amp',
    C: 'Cmp',
    G: 'Gmp',
    T: 'Tmp',
    U: 'Ump',
  },
  diphosphate: {
    A: 'Adp',
    C: 'Cdp',
    G: 'Gdp',
    T: 'Tdp',
    U: 'Udp',
  },
  triphosphate: {
    A: 'Atp',
    C: 'Ctp',
    G: 'Gtp',
    T: 'Ttp',
    U: 'Utp',
  },
};
