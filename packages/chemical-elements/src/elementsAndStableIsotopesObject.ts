import { elementsAndStableIsotopes } from './elementsAndStableIsotopes.js';
import type { ElementAndIsotopes } from './types.js';

export const elementsAndStableIsotopesObject: Record<
  string,
  ElementAndIsotopes | undefined
> = {};
for (const element of elementsAndStableIsotopes) {
  elementsAndStableIsotopesObject[element.symbol] = element;
}
