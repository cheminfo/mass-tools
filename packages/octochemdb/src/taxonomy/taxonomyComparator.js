/**
 * An object containing two arrays
 * @typedef {object} Taxonomy
 * @property {string} [superKingdom] - The superKingdom
 * @property {string} [kingdom] - The kingdom
 * @property {string} [phylum] - The phylum
 * @property {string} [class] - The class
 * @property {string} [order] - The order
 * @property {string} [family] - The family
 * @property {string} [genus] - The genus
 * @property {string} [species] - The species
 */

const fields = [
  'superKingdom',
  'kingdom',
  'phylum',
  'class',
  'order',
  'family',
  'genus',
  'species',
];

/**
 * @description sort taxonomies by superKingdom, kingdom, phylum, class, order, family, genus, species
 * @param {Taxonomy} a
 * @param {Taxonomy} b
 * @returns {number}
 */
export function taxonomyComparator(a, b) {
  for (const field of fields) {
    if (a[field] !== b[field]) {
      return (a[field] || '').localeCompare(b[field] || '');
    }
  }
  return 0;
}
