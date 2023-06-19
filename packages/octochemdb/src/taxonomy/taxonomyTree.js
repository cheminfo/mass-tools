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
      const name = taxonomy[rank];
      if (!name) continue;
      let existing = current.find(
        (node) => node.name === name && node.rank === rank,
      );
      if (!existing) {
        existing = {
          name,
          rank,
          count: 1,
          children: [],
        };

        current.push(existing);
      } else {
        existing.count++;
      }
      current = existing.children;
    }
  }

  for (let branch of tree) {
    cleanEmptyBranches(branch);
  }
  return tree;
}

function cleanEmptyBranches(branch) {
  branch.children.forEach((child) => cleanEmptyBranches(child));

  branch.children = branch.children.filter((child) => {
    // This part is used empty nodes
    if (child.children.length === 0 && child.name === '') {
      return false;
    }
    // This part is used to remove the children in species rank
    if (child.children.length === 0 && child.name !== '') {
      delete child.children;
    }

    return true;
  });
}
