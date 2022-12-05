import { groupsObject } from 'chemical-groups';
import * as Nucleotide from 'nucleotide';
import * as Peptide from 'peptide';

const ALTERNATIVES = ['', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
const SYMBOLS = ['Θ', 'Δ', 'Λ', 'Φ', 'Ω', 'Γ', 'Χ'];

let currentSymbol = 0;

/**
 * Code that allows to split a sequence of amino acids or nucleotides natural or non natural
 * @param {string} [sequence]
 * @param {object} [options={}]
 * @param {string} [options.kind] - peptide, rna, ds-dna or dna. Default if contains U: rna, otherwise ds-dna
 * @param {string} [options.fivePrime=monophosphate] - alcohol, monophosphate, diphosphate, triphosphate
 * @param {string} [options.circular=false]
 */

export function appendResidues(data, sequence, options = {}) {
  const { kind = 'peptide' } = options;

  currentSymbol = 0;
  // we normalize the sequence to 3 letter codes

  if (kind === 'peptide') {
    sequence = Peptide.sequenceToMF(sequence);
  } else {
    sequence = Nucleotide.sequenceToMF(sequence, options);
  }

  const result = {
    begin: '',
    end: '',
    residues: [],
  };

  const STATE_BEGIN = 0;
  const STATE_MIDDLE = 1;
  const STATE_END = 2;

  let parenthesisLevel = 0;
  let state = STATE_BEGIN; // as long as we don't have an uppercase followed by 2 lowercases
  for (let i = 0; i < sequence.length; i++) {
    let currentChar = sequence.charAt(i);
    let nextChar = i < sequence.length - 1 ? sequence.charAt(i + 1) : '';
    let nextNextChar = i < sequence.length - 2 ? sequence.charAt(i + 2) : '';

    if (
      state === STATE_BEGIN &&
      currentChar.match(/[A-Z]/) &&
      nextChar.match(/[a-z]/) &&
      nextNextChar.match(/[a-z]/) &&
      parenthesisLevel === 0
    ) {
      state = STATE_MIDDLE;
    }

    if (
      state === STATE_MIDDLE &&
      !sequence.substring(i).match(/[A-Z][a-z][a-z]/) &&
      !currentChar.match(/[a-z]/) &&
      parenthesisLevel === 0
    ) {
      state = STATE_END;
    } else if (
      currentChar.match(/[A-Z]/) &&
      nextChar.match(/[a-z]/) &&
      nextNextChar.match(/[a-z]/) &&
      parenthesisLevel === 0
    ) {
      result.residues.push('');
    }

    switch (state) {
      case STATE_BEGIN:
        result.begin = result.begin + currentChar;
        break;
      case STATE_MIDDLE:
        result.residues[result.residues.length - 1] =
          result.residues[result.residues.length - 1] + currentChar;
        break;
      case STATE_END:
        result.end = result.end + currentChar;
        break;
      default:
    }

    if (currentChar === '(') {
      parenthesisLevel++;
    } else if (currentChar === ')') {
      parenthesisLevel--;
    }
  }

  // we process all the residues
  let alternatives = {};
  let replacements = {};
  for (let i = 0; i < result.residues.length; i++) {
    let label = result.residues[i];
    let residue = {
      value: label,
      results: {
        begin: [],
        end: [],
      },
    };
    residue.fromBegin = i + 1;
    residue.fromEnd = result.residues.length - i;
    residue.kind = 'residue';
    if (label.includes('(')) {
      getModifiedReplacement(label, residue, alternatives, replacements);
    } else if (groupsObject[label] && groupsObject[label].oneLetter) {
      residue.label = groupsObject[label].oneLetter;
    } else {
      getUnknownReplacement(label, residue, replacements);
    }
    result.residues[i] = residue;
  }
  result.begin = removeStartEndParenthesis(result.begin);
  result.end = removeStartEndParenthesis(result.end);
  if (result.begin.length > 2) {
    let label = options.kind === 'peptide' ? 'Nter' : "5'";
    replacements[result.begin] = {
      label,
    };
    result.begin = label;
  }
  if (result.end.length > 2) {
    let label = options.kind === 'peptide' ? 'Cter' : "3'";
    replacements[result.end] = {
      label,
    };
    result.end = label;
  }

  result.begin = { label: result.begin, kind: 'begin' };
  result.end = { label: result.end, kind: 'end' };
  result.alternatives = alternatives;
  result.replacements = replacements;

  result.all = [result.begin].concat(result.residues, [result.end]);

  result.all.forEach((entry) => {
    entry.info = {
      nbOver: 0,
      nbUnder: 0,
    };
  });

  data.residues = result;
}

function getUnknownReplacement(unknownResidue, residue, replacements) {
  if (!replacements[unknownResidue]) {
    replacements[unknownResidue] = {
      label: SYMBOLS[currentSymbol] || '?',
      id: unknownResidue,
    };
  }
  currentSymbol++;
  residue.replaced = true;
  residue.label = replacements[unknownResidue].label;
}

function getModifiedReplacement(
  modifiedResidue,
  residue,
  alternatives,
  replacements,
) {
  if (!replacements[modifiedResidue]) {
    let position = modifiedResidue.indexOf('(');
    let residueCode = modifiedResidue.substring(0, position);
    let modification = removeStartEndParenthesis(
      modifiedResidue.substring(position),
    );

    if (
      groupsObject[residueCode] &&
      groupsObject[residueCode].alternativeOneLetter
    ) {
      let alternativeOneLetter = groupsObject[residueCode].alternativeOneLetter;

      if (!alternatives[alternativeOneLetter]) {
        alternatives[alternativeOneLetter] = { count: 1 };
      } else {
        alternatives[alternativeOneLetter].count++;
      }
      replacements[modifiedResidue] = {
        label:
          ALTERNATIVES[alternatives[alternativeOneLetter].count - 1] +
          alternativeOneLetter,
        residue: residueCode,
        modification,
      };
    } else {
      getUnknownReplacement(modifiedResidue, residue, replacements);
    }
  }
  residue.replaced = true;
  residue.label = replacements[modifiedResidue].label;
}

function removeStartEndParenthesis(mf) {
  if (mf[0] === '(' && mf[mf.length - 1] === ')') {
    return mf.substring(1, mf.length - 1);
  }
  return mf;
}
