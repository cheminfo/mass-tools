import { search } from '@orama/orama';

export async function searchPubmedsDB(
  pubmedsDB,
  pubmeds,
  terms = '',
  options = {},
) {
  const {
    maxNbEntries = 100,
    minScore = 0.5,
    relevance = { k: 1.2, b: 0.75, d: 0.5 },
    tolerance = 1,
    queryFields = ['title', 'abstract', 'meshHeadings'],
    boostFields = {
      title: 2,
      abstract: 1,
      meshHeadings: 1,
    },
    abstractsLimit = 1000,
  } = options;
  if (terms === '') {
    throw new Error('terms is empty');
  }
  if (pubmeds.length > abstractsLimit) {
    queryFields.splice(queryFields.indexOf('abstract'), 1);
  }
  let queryResult = await search(pubmedsDB, {
    term: terms,
    properties: queryFields,
    boost: boostFields,
    relevance,
    tolerance,
  });
  queryResult.hits.map((item) => {
    let nbCompounds = 2;
    if (item.document.nbCompounds) {
      nbCompounds = +Number(item.document.nbCompounds);
    }
    item.score = item.score / Math.log2(nbCompounds);

    return item;
  });

  let results = [];

  for (let result of queryResult.hits) {
    let id = result.document.$id;
    let pubmedDocument = pubmeds.find((pubmed) => pubmed.$id === id);

    results.push({ ...pubmedDocument, score: result.score });
  }
  results = results.filter((result) => result.score >= minScore);
  if (results.length > maxNbEntries) {
    results.length = maxNbEntries;
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}
