import { search } from '@orama/orama';

export async function searchTaxonomiesDB(
  taxonomiesDB,
  taxonomies,
  terms = '',
  options = {},
) {
  const {
    queryFields = [
      'superKingdom',
      'kingdom',
      'phylum',
      'class',
      'order',
      'family',
      'genus',
      'species',
    ],
    maxNbEntries = 50,
    minScore = 0.5,
    tolerance = 1,
  } = options;
  if (terms === '') {
    throw new Error('terms is empty');
  }

  let queryResult = await search(taxonomiesDB, {
    term: terms,
    properties: queryFields,
    tolerance,
    limit: maxNbEntries,
  });
  let results = [];
  for (let result of queryResult.hits) {
    let keys = Object.keys(result.document);
    let currentTaxonomy = {};
    for (let key of keys) {
      if (key !== '$id') {
        currentTaxonomy[key] = result.document[key];
      } else {
        currentTaxonomy.dbRef = { $id: result.document.$id };
      }
    }

    let taxonomiesDocument = taxonomies.filter((taxonomy) =>
      Object.keys(currentTaxonomy).every((key) => {
        if (key === 'dbRef') {
          return currentTaxonomy[key].$id === taxonomy.dbRef.$id;
        }
        return currentTaxonomy[key] === taxonomy[key];
      }),
    );

    for (let taxonomy of taxonomiesDocument) {
      taxonomy.score = result.score;
      results.push(taxonomy);
    }
  }
  results = results.filter((result) => result.score >= minScore);
  if (results.length > maxNbEntries) {
    results.length = maxNbEntries;
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}
