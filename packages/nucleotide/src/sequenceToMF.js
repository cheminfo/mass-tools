'use strict';

const { groups } = require('chemical-groups');

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

    currentSymbol = currentSymbol.replace(/[ \t\r\n]/, '');
    if (!currentSymbol) continue;
    if (currentSymbol.match(/[atcgu]/i)) {
      currentSymbol = currentSymbol.toUpperCase();
    }

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

module.exports = sequenceToMF;

const complementary = {
  A: 'T',
  T: 'A',
  C: 'G',
  G: 'C',
};

const desoxyNucleotides = {
  alcohol: {},
  monophosphate: {},
  diphosphate: {},
  triphosphate: {},
};

groups
  .filter((group) => group.kind === 'DNA')
  .forEach((group) => {
    if (group.oneLetter) {
      desoxyNucleotides.alcohol[group.oneLetter] = group.symbol;
    }
  });

groups
  .filter((group) => group.kind === 'DNAp')
  .forEach((group) => {
    if (group.oneLetter) {
      desoxyNucleotides.monophosphate[group.oneLetter] = group.symbol;
    }
  });

groups
  .filter((group) => group.kind === 'NucleotideP')
  .forEach((group) => {
    if (group.oneLetter) {
      desoxyNucleotides.monophosphate[group.oneLetter] = group.symbol;
    }
  });

groups
  .filter((group) => group.kind === 'DNApp')
  .forEach((group) => {
    if (group.oneLetter) {
      desoxyNucleotides.diphosphate[group.oneLetter] = group.symbol;
    }
  });

groups
  .filter((group) => group.kind === 'DNAppp')
  .forEach((group) => {
    if (group.oneLetter) {
      desoxyNucleotides.triphosphate[group.oneLetter] = group.symbol;
    }
  });

const oxyNucleotides = {
  alcohol: {},
  monophosphate: {},
  diphosphate: {},
  triphosphate: {},
};

groups
  .filter((group) => group.kind === 'RNA')
  .forEach((group) => {
    if (group.oneLetter) {
      oxyNucleotides.alcohol[group.oneLetter] = group.symbol;
    }
  });

groups
  .filter((group) => group.kind === 'RNAp')
  .forEach((group) => {
    if (group.oneLetter) {
      oxyNucleotides.monophosphate[group.oneLetter] = group.symbol;
    }
  });

groups
  .filter((group) => group.kind === 'NucleotideP')
  .forEach((group) => {
    if (group.oneLetter) {
      oxyNucleotides.monophosphate[group.oneLetter] = group.symbol;
    }
  });

groups
  .filter((group) => group.kind === 'RNApp')
  .forEach((group) => {
    if (group.oneLetter) {
      oxyNucleotides.diphosphate[group.oneLetter] = group.symbol;
    }
  });

groups
  .filter((group) => group.kind === 'RNAppp')
  .forEach((group) => {
    if (group.oneLetter) {
      oxyNucleotides.triphosphate[group.oneLetter] = group.symbol;
    }
  });
