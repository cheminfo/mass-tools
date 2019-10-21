'use strict';

const Peptide = require('peptide');
const Nucleotide = require('nucleotide');
const groups = require('chemical-groups').getGroupsObject();

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

module.exports = function sequenceParser(sequence, options = {}) {
  const { kind = 'peptide' } = options;

  // we normalize the sequence to 3 letter codes
  if (kind === 'peptide') {
    sequence = Peptide.sequenceToMF(sequence);
  } else {
    sequence = Nucleotide.sequenceToMF(sequence, options);
  }

  const result = {
    begin: '',
    end: '',
    parts: []
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
    } else {
      if (
        currentChar.match(/[A-Z]/) &&
        nextChar.match(/[a-z]/) &&
        nextNextChar.match(/[a-z]/) &&
        parenthesisLevel === 0
      ) {
        result.parts.push('');
      }
    }

    switch (state) {
      case STATE_BEGIN:
        result.begin = result.begin + currentChar;
        break;
      case STATE_MIDDLE:
        result.parts[result.parts.length - 1] =
          result.parts[result.parts.length - 1] + currentChar;
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

  // we process all the parts
  let alternatives = {};
  let replacements = {};
  for (let i = 0; i < result.parts.length; i++) {
    let code = result.parts[i];
    let part = {
      value: code
    };
    if (code.includes('(')) {
      getModifiedReplacement(code, part, alternatives, replacements);
    } else {
      if (groups[code] && groups[code].oneLetter) {
        part.code = groups[code].oneLetter;
      } else {
        getUnknownReplacement(code, part, replacements);
      }
    }
    result.parts[i] = part;
  }
  result.alternatives = alternatives;
  result.replacements = replacements;

  result.begin = removeStartEndParenthesis(result.begin);
  result.end = removeStartEndParenthesis(result.end);

  return result;
};

function getUnknownReplacement(unknownResidue, part, replacements) {
  if (!replacements[unknownResidue]) {
    replacements[unknownResidue] = {
      code: SYMBOLS[currentSymbol],
      id: unknownResidue
    };
  }
  currentSymbol++;
  part.code = replacements[unknownResidue].code;
}

function getModifiedReplacement(
  modifiedResidue,
  part,
  alternatives,
  replacements
) {
  if (!replacements[modifiedResidue]) {
    let position = modifiedResidue.indexOf('(');
    let residue = modifiedResidue.substring(0, position);
    let modification = removeStartEndParenthesis(
      modifiedResidue.substring(position)
    );

    if (groups[residue] && groups[residue].alternativeOneLetter) {
      let alternativeOneLetter = groups[residue].alternativeOneLetter;

      if (!alternatives[alternativeOneLetter]) {
        alternatives[alternativeOneLetter] = { count: 1 };
      } else {
        alternatives[alternativeOneLetter].count++;
      }
      replacements[modifiedResidue] = {
        code:
          ALTERNATIVES[alternatives[alternativeOneLetter].count - 1] +
          alternativeOneLetter,
        residue,
        modification
      };
    } else {
      getUnknownReplacement(modifiedResidue, part, replacements);
    }
  }

  part.code = replacements[modifiedResidue].code;
}

function removeStartEndParenthesis(mf) {
  if (mf[0] === '(' && mf[mf.length - 1] === ')') {
    return mf.substring(1, mf.length - 1);
  }
  return mf;
}
