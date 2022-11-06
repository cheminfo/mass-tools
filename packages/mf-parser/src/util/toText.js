import { Format } from '../Format';

import { superscript, subscript } from './subSuperscript';

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
