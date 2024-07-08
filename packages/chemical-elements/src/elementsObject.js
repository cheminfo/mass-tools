import { elements } from './elements.js';

export const elementsObject = {};
for (const element of elements) {
  elementsObject[element.symbol] = element;
}
