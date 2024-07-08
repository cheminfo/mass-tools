import { elementsAndIsotopes } from './elementsAndIsotopes.js';

export const elementsAndStableIsotopes = structuredClone(elementsAndIsotopes);

for (const element of elementsAndStableIsotopes) {
  element.isotopes = element.isotopes.filter((i) => i.abundance > 0);
}
