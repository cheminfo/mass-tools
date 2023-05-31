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
  });
  let results = [];
  for (let result of queryResult.hits) {
    let id = result.document.$id;
    let species = result.document?.species;
    let genus = result.document?.genus;
    let family = result.document?.family;
    let order = result.document?.order;
    let phylum = result.document?.phylum;
    let kingdom = result.document?.kingdom;
    let superKingdom = result.document?.superKingdom;
    let taxonomiesDocument = taxonomies.find((taxonomy) => {
      return (
        taxonomy.dbRef.$id === id &&
        (taxonomy?.species === species ||
          taxonomy?.genus === genus ||
          taxonomy?.family === family ||
          taxonomy?.order === order ||
          taxonomy?.phylum === phylum ||
          taxonomy?.kingdom === kingdom ||
          taxonomy?.superKingdom === superKingdom)
      );
    });

    results.push({ ...taxonomiesDocument, score: result.score });
  }
  results = results.filter((result) => result.score >= minScore);
  if (results.length > maxNbEntries) {
    results.length = maxNbEntries;
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}
