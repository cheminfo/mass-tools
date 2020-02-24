'use strict';

const elements = require('./elements.json');

elements.forEach((element) => {
  element.isotopes = element.isotopes.filter((i) => i.abundance > 0);
});

module.exports = elements;
