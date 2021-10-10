'use strict';

const elements = require('./elements.json');

let isotopeObject = {};
for (const element of elements) {
  let abundance = 0;
  let mostAbundant = 0;
  for (const isotope of element.isotopes) {
    if (isotope.abundance > abundance) {
      abundance = isotope.abundance;
      mostAbundant = isotope.nominal;
    }
  }

  for (const isotope of element.isotopes) {
    if (isotope.abundance === 0) continue;

    const entry = {
      name: element.name,
      mass: isotope.mass,
      symbol: element.symbol,
    };
    if (isotope.nominal === mostAbundant) {
      entry.mostAbundant = true;
    }
    isotopeObject[isotope.nominal + element.symbol] = entry;
  }
}

module.exports = isotopeObject;
