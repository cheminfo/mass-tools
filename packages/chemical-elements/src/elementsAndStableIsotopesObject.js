import { elementsAndStableIsotopes } from './elementsAndStableIsotopes.js';

export const elementsAndStableIsotopesObject = {};
for (const element of elementsAndStableIsotopes) {
  elementsAndStableIsotopesObject[element.symbol] = element;
}
