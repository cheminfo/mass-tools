'use strict';

const Format = require('../Format');
const Style = require('../Style');

const superscript = {
  0: '⁰',
  1: '¹',
  2: '²',
  3: '³',
  4: '⁴',
  5: '⁵',
  6: '⁶',
  7: '⁷',
  8: '⁸',
  9: '⁹',
  '+': '⁺',
  '-': '⁻',
  '(': '⁽',
  ')': '⁾',
  '{': '⁽',
  '}': '⁾',
  '.': '˙',
  ',': '˙',
};

const subscript = {
  0: '₀',
  1: '₁',
  2: '₂',
  3: '₃',
  4: '₄',
  5: '₅',
  6: '₆',
  7: '₇',
  8: '₈',
  9: '₉',
  '(': '₍',
  ')': '₎',
  '{': '₍',
  '}': '₎',
  '.': ' ',
  ',': ' ',
};

module.exports = function toText(lines) {
  let text = [];
  for (let line of lines) {
    switch (line.kind) {
      case Format.SUBSCRIPT:
        {
          const value = String(line.value);
          for (let i = 0; i < value.length; i++) {
            const char = value[i];
            if (subscript[char]) {
              text.push(subscript[char]);
            } else {
              throw new Error(`Subscript problem with: ${char}`);
            }
          }
        }
        break;
      case Format.SUPERSCRIPT: {
        const value = String(line.value);
        for (let i = 0; i < value.length; i++) {
          const char = value[i];
          if (superscript[char]) {
            text.push(superscript[char]);
          } else {
            throw new Error(`Superscript problem with: ${char}`);
          }
        }
        break;
      }
      case Format.SUPERIMPOSE: {
        const under = String(line.under);
        for (let i = 0; i < under.length; i++) {
          const char = under[i];
          if (subscript[char]) {
            text.push(subscript[char]);
          } else {
            throw new Error(`Subscript problem with: ${char}`);
          }
        }
        const over = String(line.over);
        for (let i = 0; i < over.length; i++) {
          const char = over[i];
          if (superscript[char]) {
            text.push(superscript[char]);
          } else {
            throw new Error(`Superscript problem with: ${char}`);
          }
        }
        break;
      }
      default:
        text.push(line.value);
    }
  }
  return text.join('');
};
