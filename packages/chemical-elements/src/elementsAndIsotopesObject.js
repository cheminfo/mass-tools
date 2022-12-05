import { elementsAndIsotopes } from './elementsAndIsotopes.js';

export const elementsAndIsotopesObject = {};
elementsAndIsotopes.forEach((element) => {
  elementsAndIsotopesObject[element.symbol] = element;
});
