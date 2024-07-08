import { groups } from 'chemical-groups';

import { ensureUppercaseSequence } from './ensureUppercaseSequence';

/**
 * Convert a nucleic sequence to a MF
 * @param {String} sequence
 * @param {object} [options={}]
 * @param {string} [options.kind] - rna, ds-dna or dna. Default if contains U: rna, otherwise ds-dna
 * @param {string} [options.fivePrime=monophosphate] - alcohol, monophosphate, diphosphate, triphosphate
 * @param {string} [options.circular=false]
 */

export function sequenceToMF(sequence, options = {}) {
  let fivePrimeTerminal = 'HO';
  let threePrimeTerminal = 'H';
  sequence = sequence.replace(/^HO/, '');
  sequence = sequence.replace(/H$/, '');
  sequence = sequence.trim();

  if (sequence === '') return '';

  sequence = ensureUppercaseSequence(sequence);

  // if the sequence is in lowercase but the parenthesis we should convert it to uppercase

  if (sequence.match(/^[a-z]+$/)) {
    sequence = sequence.toUpperCase();
  }

  let { kind, circular, fivePrime = 'monophosphate' } = options;
  fivePrime = fivePrime.replaceAll(/[^A-Za-z]/g, '').toLowerCase();

  if (!kind) {
    if (sequence.includes('U')) {
      kind = 'rna';
    } else {
      kind = 'ds-dna';
    }
  }

  kind = kind.replaceAll(/[^A-Za-z]/g, '').toLowerCase();

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
    while (sequence[i + 1] && sequence[i + 1].match(/[a-z]/)) {
      i++;
      currentSymbol += sequence[i];
    }

    if (currentSymbol.length > 1) {
      results[0].push(currentSymbol);
      continue;
    }

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

    currentSymbol = currentSymbol.replace(/[\t\n\r ]/, '');
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
    for (const result of results) result.unshift(fivePrimeTerminal);
    for (const result of results) result.push(threePrimeTerminal);
  }

  return results.map((result) => result.join('')).join('.');
}

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

for (const group of groups.filter(({ kind }) => kind === 'DNA')) {
  if (group.oneLetter) {
    desoxyNucleotides.alcohol[group.oneLetter] = group.symbol;
  }
}

for (const group of groups.filter(({ kind }) => kind === 'DNAp')) {
  if (group.oneLetter) {
    desoxyNucleotides.monophosphate[group.oneLetter] = group.symbol;
  }
}

for (const group of groups.filter(({ kind }) => kind === 'NucleotideP')) {
  if (group.oneLetter) {
    desoxyNucleotides.monophosphate[group.oneLetter] = group.symbol;
  }
}

for (const group of groups.filter(({ kind }) => kind === 'DNApp')) {
  if (group.oneLetter) {
    desoxyNucleotides.diphosphate[group.oneLetter] = group.symbol;
  }
}

for (const group of groups.filter(({ kind }) => kind === 'DNAppp')) {
  if (group.oneLetter) {
    desoxyNucleotides.triphosphate[group.oneLetter] = group.symbol;
  }
}

const oxyNucleotides = {
  alcohol: {},
  monophosphate: {},
  diphosphate: {},
  triphosphate: {},
};

for (const group of groups.filter(({ kind }) => kind === 'RNA')) {
  if (group.oneLetter) {
    oxyNucleotides.alcohol[group.oneLetter] = group.symbol;
  }
}

for (const group of groups.filter(({ kind }) => kind === 'RNAp')) {
  if (group.oneLetter) {
    oxyNucleotides.monophosphate[group.oneLetter] = group.symbol;
  }
}

for (const group of groups.filter(({ kind }) => kind === 'NucleotideP')) {
  if (group.oneLetter) {
    oxyNucleotides.monophosphate[group.oneLetter] = group.symbol;
  }
}

for (const group of groups.filter(({ kind }) => kind === 'RNApp')) {
  if (group.oneLetter) {
    oxyNucleotides.diphosphate[group.oneLetter] = group.symbol;
  }
}

for (const group of groups.filter(({ kind }) => kind === 'RNAppp')) {
  if (group.oneLetter) {
    oxyNucleotides.triphosphate[group.oneLetter] = group.symbol;
  }
}
