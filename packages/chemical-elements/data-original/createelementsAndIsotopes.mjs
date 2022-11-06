import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import Papa from 'papaparse';

let names = Papa.parse(
  readFileSync(new URL('names.tsv', import.meta.url), 'utf8'),
  {
    header: true,
    delimiter: '\t',
  },
).data;

let elementsAndIsotopes = JSON.parse(
  readFileSync(new URL('isotopes.json', import.meta.url), 'utf-8'),
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

writeFileSync(
  new URL('../src/elementsAndIsotopes.js', import.meta.url),
  `export const elementsAndIsotopes=${JSON.stringify(elementsAndIsotopes)}`,
  'utf8',
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
