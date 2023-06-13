import { taxonomyRanks } from './taxonomyRanks';
/**
 * @description Creates a tree structure from an array of taxonomies.
 *
 * @param {import('./Taxonomy.js').Taxonomy[]} taxonomies - The array of taxonomies to create a tree from.
 * @returns {Object[]} The tree structure.
 */
export function taxonomyTree(taxonomies) {
  const tree = [];

  for (let taxonomy of taxonomies) {
    let current = tree;
    for (let rank of taxonomyRanks) {
      const name = taxonomy[rank] || '';
      let existing = current.find(
        (node) => node.name === name && node.rank === rank,
      );
      if (!existing) {
        existing = {
          name,
          rank,
          count: 1,
        };
        if (taxonomyRanks.indexOf(rank) < taxonomyRanks.length - 1) {
          existing.children = [];
        }
        current.push(existing);
      } else {
        existing.count++;
      }
      current = existing.children;
    }
  }

  return tree;
}
