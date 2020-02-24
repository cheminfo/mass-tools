'use strict';

let elements = require('chemical-elements').elementsObject;
let groups = require('chemical-groups').getGroupsObject();

function isMF(mf) {
  let tmpMF = mf.replace(/[^a-zA-Z]/g, '');
  let parts = tmpMF.replace(/([A-Za-z])(?=[A-Z])/g, '$1 ').split(' ');
  for (let i = 0; i < parts.length; i++) {
    if (!elements[parts[i]] && !groups[parts[i]]) {
      return false;
    }
  }

  return true;
}

module.exports = isMF;
