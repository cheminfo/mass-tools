import { elementsAndIsotopes } from './elementsAndIsotopes.js';

export const elements = elementsAndIsotopes.map((element) => ({
  number: element.number,
  symbol: element.symbol,
  mass: element.mass,
  name: element.name,
  monoisotopicMass: element.monoisotopicMass,
}));
