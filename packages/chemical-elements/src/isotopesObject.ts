import { elementsAndIsotopesObject } from './elementsAndIsotopesObject.js';

interface Isotope {
  abundance: number | undefined;
  mass: number;
}

export const isotopesObject: Record<string, Isotope | undefined> = {};

for (const [symbol, element] of Object.entries(elementsAndIsotopesObject)) {
  if (!element) continue;
  for (const isotope of element.isotopes) {
    isotopesObject[`${isotope.nominal}${symbol}`] = {
      abundance: isotope.abundance,
      mass: isotope.mass,
    };
  }
}
