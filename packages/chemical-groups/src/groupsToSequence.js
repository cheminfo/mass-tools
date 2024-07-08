import { groupsObject } from './groupsObject.js';

/**
 * Recreate a one letter sequence
 * @param {object} mf
 */

export function groupsToSequence(mf) {
  mf = mf.replaceAll(/\([^(]*\)/g, '');
  let parts = mf.split(/(?=[ A-Z])/);
  let usefulParts = [];
  for (let part of parts) {
    if (part === ' ') {
      usefulParts.push(' ');
      continue;
    }
    if (!part.match(/^[A-Z][a-z]{2,6}/)) continue;
    if (groupsObject[part] && groupsObject[part].oneLetter) {
      usefulParts.push(groupsObject[part].oneLetter);
    } else {
      usefulParts.push('?');
    }
  }
  return usefulParts.join('').replaceAll(/ +/g, ' ').trim();
}
