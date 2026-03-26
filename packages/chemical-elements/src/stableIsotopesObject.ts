import { elementsAndIsotopes } from './elementsAndIsotopes.js';

interface StableIsotope {
  /** Element name (e.g., "Carbon"). */
  name: string;
  /** Exact mass of the isotope in Da. */
  mass: number;
  /** Element symbol (e.g., "C"). */
  symbol: string;
  /** Whether this is the most abundant stable isotope of the element. */
  mostAbundant: boolean;
  /** Difference in neutron count relative to the most abundant isotope (e.g., +1 for 13C, -1 for 10B). */
  deltaNeutrons: number;
}

export const stableIsotopesObject: Record<string, StableIsotope | undefined> =
  {};

for (const element of elementsAndIsotopes) {
  let abundance = 0;
  let mostAbundant = 0;
  for (const isotope of element.isotopes) {
    if (
      typeof isotope.abundance === 'number' &&
      isotope.abundance > abundance
    ) {
      abundance = isotope.abundance;
      mostAbundant = isotope.nominal;
    }
  }

  for (const isotope of element.isotopes) {
    if (isotope.abundance === 0) continue;

    const entry = {
      name: element.name,
      mass: isotope.mass,
      symbol: element.symbol,
      mostAbundant: false,
      deltaNeutrons: isotope.nominal - mostAbundant,
    };
    if (isotope.nominal === mostAbundant) {
      entry.mostAbundant = true;
    }
    stableIsotopesObject[`${isotope.nominal}${element.symbol}`] = entry;
  }
}
