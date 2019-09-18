'use strict';

const groups = require('./groups.js');

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
};
