import { stableIsotopesObject } from 'chemical-elements';
import { subscript, superscript } from 'mf-parser';

/**
 * Calcultes informations about the isotopic composition explaining a specific mass
 * @param {Record<string, number>} composition
 * @returns
 */
export function getDerivedCompositionInfo(composition) {
  const shortComposition = {};
  let label = '';
  let shortLabel = '';
  for (let key in composition) {
    let isotopeLabel = '';
    for (let i = 0; i < key.length; i++) {
      if (superscript[key[i]]) {
        isotopeLabel += superscript[key[i]];
      } else {
        isotopeLabel += key[i];
      }
    }
    if (composition[key] > 1) {
      const number = String(composition[key]);
      for (let i = 0; i < number.length; i++) {
        isotopeLabel += subscript[number[i]];
      }
    }
    label += isotopeLabel;
    if (stableIsotopesObject[key].mostAbundant) continue;
    shortLabel += isotopeLabel;
    shortComposition[key] = composition[key];
  }

  return { label, shortComposition, shortLabel };
}
