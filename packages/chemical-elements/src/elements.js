'use strict';

const elements = require('./elements.json');

const data = elements.map((element) => ({
  number: element.number,
  symbol: element.symbol,
  mass: element.mass,
  name: element.name,
  monoisotopicMass: element.monoisotopicMass,
}));

module.exports = data;
