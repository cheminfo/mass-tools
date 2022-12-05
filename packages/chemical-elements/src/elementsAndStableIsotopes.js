import { elementsAndIsotopes } from './elementsAndIsotopes.js';

export const elementsAndStableIsotopes = JSON.parse(
  JSON.stringify(elementsAndIsotopes),
);

elementsAndStableIsotopes.forEach((element) => {
  element.isotopes = element.isotopes.filter((i) => i.abundance > 0);
});
