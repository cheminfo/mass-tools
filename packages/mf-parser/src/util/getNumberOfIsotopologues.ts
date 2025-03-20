import { elementsAndStableIsotopesObject } from 'chemical-elements';

import type { AtomsMap } from './partToAtoms';

/**
 * Return the theoretical number of isotopologues for a given MF.
 * This method will not take into account possible non natural isotopic distribution (e.g. 13C enrichment)
 * @param atoms
 * @returns
 */
export function getNumberOfIsotopologues(atoms: AtomsMap) {
  let result = 1;
  for (const atom in atoms) {
    const nbIsotopes = elementsAndStableIsotopesObject[atom]?.isotopes.length;
    if (!nbIsotopes) {
      throw new Error(`No stable isotopes found for ${atom}`);
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
