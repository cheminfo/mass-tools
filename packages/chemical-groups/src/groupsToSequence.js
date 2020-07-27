'use strict';

const groupsObject = require('./groupsObject.js');

/**
 * Recreate a one letter sequence
 * @param {} mf
 */

function groupsToSequence(mf) {
  mf = mf.replace(/\([^(]*\)/g, '');
  let parts = mf.split(/(?=[A-Z])/);
  let usefulParts = [];
  for (let part of parts) {
    if (part.length < 3) continue;
    if (groupsObject[part] && groupsObject[part].oneLetter) {
      usefulParts.push(groupsObject[part].oneLetter);
    } else {
      usefulParts.push('?');
    }
  }
  return usefulParts.join('');
}

module.exports = groupsToSequence;
