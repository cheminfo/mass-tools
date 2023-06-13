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
      if (taxonomy[rank]) {
        const name = taxonomy[rank];
        let existing = current.find((node) => node.name === name);
        if (!existing) {
          existing = {
            name,
            rank,
            children: rank !== 'species' ? [] : undefined,
          };
          current.push(existing);
        }

        current = existing.children;
      }
    }
  }

  return tree;
}
