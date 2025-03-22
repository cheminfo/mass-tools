import { elementsAndStableIsotopesObject } from 'chemical-elements';

import type { AtomsMap } from './partToAtoms';

/**
 * Returns the theoretical number of isotopologues for a given MF based on stable isotopes for each element.
 * This method will not take into account possible non natural isotopic composition (e.g. 13C enrichment)
 * If one element does not have any stable isotope, the result will be 0.
 * @param atoms
 * @returns
 */
export function getNumberOfIsotopologues(atoms: AtomsMap): number {
  if (Object.keys(atoms).length === 0) {
    return 0;
  }
  let result = 1;
  for (const atom in atoms) {
    const nbIsotopes = elementsAndStableIsotopesObject[atom]?.isotopes.length;
    if (!nbIsotopes) {
      return 0;
    }
    const nbAtoms = atoms[atom];
    result *= getNbCombinationsPerAtom(nbAtoms, nbIsotopes);
  }
  return result;
}

/**
 * Returns the number of isotopologues for one specific atom
 *
 * @param nbAtoms
 * @param nbIsotopes
 * @returns
 */
function getNbCombinationsPerAtom(nbAtoms: number, nbIsotopes: number) {
  let result = 1;
  for (let i = nbAtoms + 1; i < nbAtoms + nbIsotopes; i++) {
    result *= i;
  }
  for (let i = 2; i < nbIsotopes; i++) {
    result /= i;
  }
  return result;
}
