'use strict';

/*
Code that allows to split a sequence of aminoacids natural or non natural
*/

module.exports = function sequenceSplitter(sequence) {
  let parts = [''];
  if (sequence.match(/^[A-Z ]+$/)) {
    parts = sequence.replace(/ /g, '').split(/(?=[A-Z])/);
  } else {
    // we need to deal with upper and lowercases
    sequence = sequence.replace(/ /g, '');
    let parenthesisLevel = 0;
    let begin = true;
    for (let i = 0; i < sequence.length; i++) {
      let currentChar = sequence.charAt(i);
      parts[parts.length - 1] += currentChar;
      let nextChar = i < sequence.length - 1 ? sequence.charAt(i + 1) : '';
      let nextNextChar = i < sequence.length - 2 ? sequence.charAt(i + 2) : '';
      if (currentChar === '(') {
        parenthesisLevel++;
      } else if (currentChar === ')') {
        parenthesisLevel--;
      }
      if (
        nextChar.match(/[A-Z]/) &&
        nextNextChar.match(/[a-z]/) &&
        parenthesisLevel === 0
      ) {
        if (begin) {
          begin = false;
        } else {
          parts.push('');
        }
      }
    }
  }
  return parts;
};
