import elements from './elements.json';

export const elementsAndIsotopesObject = {};
elements.forEach((element) => {
  elementsAndIsotopesObject[element.symbol] = element;
});
