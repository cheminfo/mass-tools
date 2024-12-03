import { elementsAndIsotopes } from './elementsAndIsotopes.js';
import type { ElementAndIsotopes } from './types.js';

export const elementsAndIsotopesObject: Record<
  string,
  ElementAndIsotopes | undefined
> = {};
for (const element of elementsAndIsotopes) {
  elementsAndIsotopesObject[element.symbol] = element;
}
