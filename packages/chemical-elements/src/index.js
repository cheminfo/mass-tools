'use strict';

const elements = require('./elementsAndStableIsotopes.js');
const { ELECTRON_MASS } = require('./constants');

function getElementsObject() {
  let object = {};
  elements.forEach((e) => {
    object[e.symbol] = e;
  });
  return object;
}

module.exports = {
  elements,
  getElementsObject,
  ELECTRON_MASS,
};
