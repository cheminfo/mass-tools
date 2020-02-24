'use strict';

const elements = require('./elements.js');

let elementsObject = {};
elements.forEach((element) => {
  elementsObject[element.symbol] = element;
});

module.exports = elementsObject;
