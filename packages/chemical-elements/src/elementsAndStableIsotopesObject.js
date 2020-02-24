'use strict';

const elementsAndStableIsotopes = require('./elementsAndStableIsotopes.js');

let elementsAndStableIsotopesObject = {};
elementsAndStableIsotopes.forEach((element) => {
  elementsAndStableIsotopesObject[element.symbol] = element;
});

module.exports = elementsAndStableIsotopesObject;
