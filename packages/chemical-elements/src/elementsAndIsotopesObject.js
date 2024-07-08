import { elementsAndIsotopes } from './elementsAndIsotopes.js';

export const elementsAndIsotopesObject = {};
for (const element of elementsAndIsotopes) {
  elementsAndIsotopesObject[element.symbol] = element;
}
