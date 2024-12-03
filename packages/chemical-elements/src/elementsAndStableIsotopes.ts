import { elementsAndIsotopes } from './elementsAndIsotopes.js';

export const elementsAndStableIsotopes = structuredClone(elementsAndIsotopes);

for (const element of elementsAndStableIsotopes) {
  element.isotopes = element.isotopes.filter((i) => {
    return typeof i.abundance === 'number' && i.abundance > 0;
  });
}
