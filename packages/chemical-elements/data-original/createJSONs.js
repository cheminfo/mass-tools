'use strict';

const fs = require('fs');
const { join } = require('path');

const Papa = require('papaparse');

const MODULE = "'use strict';\nmodule.exports=";

let names = Papa.parse(`${fs.readFileSync(`${__dirname}/names.tsv`)}`, {
  header: true,
  delimiter: '\t',
}).data;

let elementsAndIsotopes = JSON.parse(
  fs.readFileSync(`${__dirname}/isotopes.json`),
);

for (let i = 0; i < elementsAndIsotopes.length; i++) {
  let element = elementsAndIsotopes[i];
  let name = names[i];
  if (element.symbol !== name.symbol) {
    // eslint-disable-next-line no-console
    console.log('Symbol inconsistency:', i + 1, element.symbol, name.symbol);
    element.symbol = name.symbol;
  }
  element.name = name.name;

  let massFromIsotopes = getMass(element);

  element.monoisotopicMass = getMonoisotopicMass(element);

  // need to decide which element mass to give, we calculate it ourself
  element.mass = massFromIsotopes ? massFromIsotopes : null;
}

fs.writeFileSync(
  join(__dirname, '../src/elements.json'),
  JSON.stringify(elementsAndIsotopes, undefined, 2),
);

function getMass(element) {
  let stable = element.isotopes.filter((a) => a.abundance > 0);
  let mass = 0;
  stable.forEach((a) => {
    mass += a.abundance * a.mass;
  });
  return mass;
}

function getMonoisotopicMass(element) {
  let monoisotopicMass;
  let maxAbundance = 0;
  for (let isotope of element.isotopes) {
    if (isotope.abundance > maxAbundance) {
      maxAbundance = isotope.abundance;
      monoisotopicMass = isotope.mass;
    }
  }
  return monoisotopicMass;
}
