import originalElements from './elements.json';

export const elements = originalElements.map((element) => ({
  number: element.number,
  symbol: element.symbol,
  mass: element.mass,
  name: element.name,
  monoisotopicMass: element.monoisotopicMass,
}));
