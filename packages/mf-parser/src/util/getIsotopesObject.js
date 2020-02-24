'use strict';

const elements = require('chemical-elements/src/elementsAndIsotopesObject.js');

const isotopes = {};
Object.keys(elements).forEach((key) => {
  let e = elements[key];
  e.isotopes.forEach((i) => {
    isotopes[i.nominal + key] = {
      abundance: i.abundance,
      mass: i.mass,
    };
  });
});

module.exports = isotopes;
