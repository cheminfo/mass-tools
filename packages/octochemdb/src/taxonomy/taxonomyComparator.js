import { taxonomyRanks } from './taxonomyRanks.js';
/**
 * @description sort taxonomies by superkingdom, kingdom, phylum, class, order, family, genus, species
 * @param {import('./Taxonomy.js').Taxonomy} a
 * @param {import('./Taxonomy.js').Taxonomy} b
 * @returns {number}
 */
export function taxonomyComparator(a, b) {
  for (const field of taxonomyRanks) {
    if (a[field] !== b[field]) {
      return (a[field] || '').localeCompare(b[field] || '');
    }
  }
  return 0;
}
