'use strict';

const elements = require('./elements.json');

let elementsAndIsotopesObject = {};
elements.forEach((element) => {
  elementsAndIsotopesObject[element.symbol] = element;
});

module.exports = elementsAndIsotopesObject;
