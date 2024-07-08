import { elementsObject } from 'chemical-elements';

const elements = new Set(
  Object.keys(elementsObject).sort((a, b) => b.length - a.length),
);

/**
 * Ensure that the mf has been entered with capital letters and not only lowercase
 * If there is only lowercase we try to capitalize the mf
 * @param {string} mf
 */

export function ensureCase(mf) {
  for (let i = 0; i < mf.length; i++) {
    // eslint-disable-next-line unicorn/prefer-code-point
    if (mf.charCodeAt(i) > 64 && mf.charCodeAt(i) < 91) {
      return mf;
    }
  }
  let parts = mf.replaceAll(/([a-z]*)([^a-z]*)/g, '$1 $2 ').split(/ +/);
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].match(/^[a-z]$/)) {
      parts[i] = parts[i].toUpperCase();
    } else if (parts[i].match(/^[a-z]+$/)) {
      let newPart = '';
      for (let j = 0; j < parts[i].length; j++) {
        let two = parts[i].slice(j, j + 2);
        let one = parts[i].charAt(j).toUpperCase();
        if (
          ['c', 'h', 'o', 'n'].includes(two.charAt(0)) &&
          ['h', 'o', 'n'].includes(two.charAt(1))
        ) {
          newPart += two.toUpperCase();
          j++;
        } else {
          two = two.charAt(0).toUpperCase() + two.charAt(1);
          if (elements.has(two)) {
            newPart += two;
            j++;
          } else if (elements.has(one)) {
            newPart += one;
          } else {
            return mf;
          }
        }
      }
      parts[i] = newPart;
    }
  }
  return parts.join('');
}
