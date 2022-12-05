import { elements } from './elements.js';

export const elementsObject = {};
elements.forEach((element) => {
  elementsObject[element.symbol] = element;
});
