import { elementsAndIsotopes } from './elementsAndIsotopes.js';

export const stableIsotopesObject = {};
for (const element of elementsAndIsotopes) {
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
    stableIsotopesObject[isotope.nominal + element.symbol] = entry;
  }
}
