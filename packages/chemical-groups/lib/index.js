'use strict';

const groups = require('./groups.js');
const groupsToSequence = require('./groupsToSequence');

function getGroupsObject() {
  let object = {};
  groups.forEach((e) => {
    object[e.symbol] = e;
  });
  return object;
}

module.exports = {
  groups,
  getGroupsObject,
  groupsToSequence,
};
