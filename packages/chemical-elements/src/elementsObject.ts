import { elements } from './elements.js';
import type { Element } from './types.js';

export const elementsObject: Record<string, Element | undefined> = {};
for (const element of elements) {
  elementsObject[element.symbol] = element;
}
