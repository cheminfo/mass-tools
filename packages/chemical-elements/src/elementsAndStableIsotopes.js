'use strict';

const elements = JSON.parse(JSON.stringify(require('./elements.json')));

elements.forEach((element) => {
  element.isotopes = element.isotopes.filter((i) => i.abundance > 0);
});

module.exports = elements;
