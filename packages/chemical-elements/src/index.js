'use strict';

const elements = require('./elements.js');
const elementsObject = require('./elementsObject.js');
const elementsAndIsotopes = require('./elementsAndIsotopes.js');
const elementsAndIsotopesObject = require('./elementsAndIsotopesObject.js');
const elementsAndStableIsotopes = require('./elementsAndStableIsotopes.js');
const elementsAndStableIsotopesObject = require('./elementsAndStableIsotopesObject.js');

const { ELECTRON_MASS } = require('./constants');

module.exports = {
  elements,
  elementsObject,
  elementsAndIsotopes,
  elementsAndIsotopesObject,
  elementsAndStableIsotopes,
  elementsAndStableIsotopesObject,
  ELECTRON_MASS,
};
