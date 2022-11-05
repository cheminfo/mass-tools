import { elementsAndStableIsotopes } from './elementsAndStableIsotopes.js';

export const elementsAndStableIsotopesObject = {};
elementsAndStableIsotopes.forEach((element) => {
  elementsAndStableIsotopesObject[element.symbol] = element;
});
