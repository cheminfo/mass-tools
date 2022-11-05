'use strict';

const { ELECTRON_MASS } = require('./constants');
const elements = require('./elements.js');
const elementsAndIsotopes = require('./elementsAndIsotopes.js');
const elementsAndIsotopesObject = require('./elementsAndIsotopesObject.js');
const elementsAndStableIsotopes = require('./elementsAndStableIsotopes.js');
const elementsAndStableIsotopesObject = require('./elementsAndStableIsotopesObject.js');
const elementsObject = require('./elementsObject.js');
const stableIsotopesObject = require('./stableIsotopesObject.js');

module.exports = {
  elements,
  elementsObject,
  elementsAndIsotopes,
  elementsAndIsotopesObject,
  elementsAndStableIsotopes,
  elementsAndStableIsotopesObject,
  stableIsotopesObject,
  ELECTRON_MASS,
};
