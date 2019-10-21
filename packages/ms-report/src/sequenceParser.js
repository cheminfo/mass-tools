'use strict';

const Peptide = require('peptide');
const Nucleotide = require('nucleotide');
require('nucleotide');

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
  console.log(sequence);
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

  return result;
};
