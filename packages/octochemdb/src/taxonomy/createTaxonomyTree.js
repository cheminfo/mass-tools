import { taxonomyRanks } from './taxonomyRanks';
/**
 * @description Creates a tree structure from an array of taxonomies.
 *
 * Names that differ only by case or by surrounding whitespace are the same
 * taxon: sources disagree on the binomial (CMAUP writes `Stevia Mercedensis`
 * where LOTUS, NPASS and COCONUT write `Stevia mercedensis`). They are merged
 * into one node, displayed with the spelling closest to the convention — an
 * initial capital and nothing capitalized after it.
 *
 * @param {import('./Taxonomy.js').Taxonomy[]} taxonomies - The array of taxonomies to create a tree from.
 * @returns {Object[]} The tree structure.
 */
export function createTaxonomyTree(taxonomies, options = {}) {
  let { rankLimit = '' } = options;
  rankLimit = rankLimit.toLowerCase();
  const tree = [];
  const indexes = new WeakMap();

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
      let index = indexes.get(current);
      if (!index) {
        index = new Map();
        indexes.set(current, index);
      }
      const key = taxonKey(name);
      let existing = index.get(key);
      if (!existing) {
        existing = {
          name,
          rank,
          count: 1,
          children: [],
        };
        if (rank === 'species' && taxonomy?.dbRef) {
          existing.url = taxonomy.dbRef.url;
        }
        current.push(existing);
        index.set(key, existing);
      } else {
        existing.count++;
        if (spellingScore(name) < spellingScore(existing.name)) {
          existing.name = name;
        }
        if (
          existing.url === undefined &&
          rank === 'species' &&
          taxonomy?.dbRef?.url
        ) {
          existing.url = taxonomy.dbRef.url;
        }
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

function taxonKey(name) {
  return name.trim().replaceAll(/\s+/g, ' ').toLowerCase();
}

/** How far a spelling is from the convention; the lowest score wins. */
function spellingScore(name) {
  let score = name && name[0] === name[0].toUpperCase() ? 0 : 1000;
  for (let index = 1; index < name.length; index++) {
    const character = name[index];
    if (character !== character.toLowerCase()) score++;
  }
  return score;
}

function cleanEmptyBranches(branch) {
  for (const child of branch.children) cleanEmptyBranches(child);

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
