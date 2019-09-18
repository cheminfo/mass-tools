'use strict';

const elements = Object.keys(
  require('chemical-elements/src/elementsAndStableIsotopesObject.js'),
).sort((a, b) => b.length - a.length);

/**
 * Ensure that the mf has been entered with capital letters and not only lowercase
 * If there is only lowercase we try to capitalize the mf
 * @param {string} mf
 */

function capitalize(mf) {
  for (let i = 0; i < mf.length; i++) {
    if (mf.charCodeAt(i) > 64 && mf.charCodeAt(i) < 91) {
      return mf;
    }
  }
  let parts = mf.replace(/([a-z]*)([^a-z]*)/g, '$1 $2 ').split(/ +/);
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].match(/^[a-z]$/)) {
      parts[i] = parts[i].toUpperCase();
    } else if (parts[i].match(/^[a-z]+$/)) {
      let newPart = '';
      for (let j = 0; j < parts[i].length; j++) {
        let two = parts[i].substr(j, 2);
        let one = parts[i].charAt(j).toUpperCase();
        if (
          ['c', 'h', 'o', 'n'].includes(two.charAt(0)) &&
          ['h', 'o', 'n'].includes(two.charAt(1))
        ) {
          newPart += two.toUpperCase();
          j++;
        } else {
          two = two.charAt(0).toUpperCase() + two.charAt(1);
          if (elements.includes(two)) {
            newPart += two;
            j++;
          } else {
            if (elements.includes(one)) {
              newPart += one;
            } else {
              return mf;
            }
          }
        }
      }
      parts[i] = newPart;
    }
  }
  return parts.join('');
}

module.exports = capitalize;
