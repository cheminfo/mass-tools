import { elementsAndIsotopes } from './elementsAndIsotopes.js';
import type { Element } from './types.js';

export const elements: Element[] = elementsAndIsotopes.map((element) => ({
  number: element.number,
  symbol: element.symbol,
  mass: element.mass,
  name: element.name,
  monoisotopicMass: element.monoisotopicMass,
}));
