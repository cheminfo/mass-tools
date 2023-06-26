import { taxonomyRanks } from './taxonomyRanks';
/**
 * @description Creates a tree structure from an array of taxonomies.
 *
 * @param {import('./Taxonomy.js').Taxonomy[]} taxonomies - The array of taxonomies to create a tree from.
 * @returns {Object[]} The tree structure.
 */
export function taxonomyTree(taxonomies, options = {}) {
  let { rankLimit = '' } = options;
  rankLimit = rankLimit.toLowerCase();
  const tree = [];

  for (let taxonomy of taxonomies) {
    let reachedRankLimit = false;
    let current = tree;
    for (let rank of taxonomyRanks) {
      if (rank === rankLimit) {
        reachedRankLimit = true;
      }
      if (reachedRankLimit && rank !== rankLimit) {
        break;
      }
      const name = taxonomy[rank] || '';
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
    nbTaxonomies(branch);
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
    // This part is used to remove the children in the lowest rank
    if (child.children.length === 0 && child.name !== '') {
      delete child.children;
    }

    return true;
  });
}

function nbTaxonomies(branch) {
  branch.nbTaxonomies = 0; // count the current node
  if (branch.children) {
    for (let child of branch.children) {
      nbTaxonomies(child);
      branch.nbTaxonomies += child.nbTaxonomies;
    }
  } else {
    branch.nbTaxonomies = 1;
  }

  return branch.nbTaxonomies;
}
