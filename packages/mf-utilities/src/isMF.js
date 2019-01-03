'use strict';

let elements = require('chemical-elements').getElementsObject();
let groups = require('chemical-groups').getGroupsObject();

function isMF(mf) {
  var tmpMF = mf.replace(/[^a-zA-Z]/g, '');
  var parts = tmpMF.replace(/([A-Za-z])(?=[A-Z])/g, '$1 ').split(' ');
  for (var i = 0; i < parts.length; i++) {
    if (!elements[parts[i]] && !groups[parts[i]]) {
      return false;
    }
  }

  return true;
}

module.exports = isMF;
