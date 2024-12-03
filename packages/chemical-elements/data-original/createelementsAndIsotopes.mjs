import { readFileSync, writeFileSync } from 'node:fs';

import Papa from 'papaparse';
import { format } from 'prettier';

let names = Papa.parse(
  readFileSync(new URL('names.tsv', import.meta.url), 'utf8'),
  {
    header: true,
    delimiter: '\t',
  },
).data;

let elementsAndIsotopes = JSON.parse(
  readFileSync(new URL('isotopes.json', import.meta.url), 'utf8'),
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

  // need to decide which element mass to give, we calculate it ourselves
  element.mass = massFromIsotopes > 0 ? massFromIsotopes : null;
}

writeFileSync(
  new URL('../src/elementsAndIsotopes.ts', import.meta.url),
  await format(
    `import type { ElementAndIsotopes } from './types.js';\n\nexport const elementsAndIsotopes: ElementAndIsotopes[] = ${JSON.stringify(elementsAndIsotopes)};`,
    {
      filepath: 'elementsAndIsotopes.ts',
      arrowParens: 'always',
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'all',
    },
  ),
  'utf8',
);

function getMass(element) {
  let stable = element.isotopes.filter((a) => a.abundance > 0);
  let mass = 0;
  for (const a of stable) {
    mass += a.abundance * a.mass;
  }
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
