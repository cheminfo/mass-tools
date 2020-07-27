'use strict';

const groupsObject = require('./groupsObject.js');

/**
 * Recreate a one letter sequence
 * @param {} mf
 */

function groupsToSequence(mf) {
  mf = mf.replace(/\([^(]*\)/g, '');
  let parts = mf.split(/(?=[A-Z ])/);
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
  return usefulParts.join('').replace(/ +/g, ' ').trim();
}

module.exports = groupsToSequence;
