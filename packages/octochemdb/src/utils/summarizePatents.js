import { create, insert, search } from '@orama/orama';
/**
 * @description This function performs a search on a list of patents and returns the most relevant ones using the BM25 algorithm.
 * @param {object[]} patents - Patents to summarize
 * @param {string} term - Search term
 * @param {object} options - Options
 * @param {number} [options.maxNbEntries=100] - Maximum number of entries to return
 * @param {number} [options.minScore=0.5] - Minimum score for an entry to be returned
 * @param {object} [options.relevance={ k: 1.2, b: 0.75, d: 0.5 }] - BM25 algorithm {k: Term frequency saturation parameter, b: Length normalization parameter, d:Frequency normalization lower bound}
 * @param {number} [options.tolerance=1] -Typo Tolerance following the Levenshtein algorithm
 * @param {string[]} [options.queryFields=['title', 'abstract']] - Fields to query
 * @param {object} [options.boostFields={ title: 2, abstract: 1 }] - Fields weights, higher weight means higher importance
 * @returns
 */
export async function summarizePatents(patents, term = '', options = {}) {
  const {
    maxNbEntries = 100,
    minScore = 0.5,
    relevance = { k: 1.2, b: 0.75, d: 0.5 },
    tolerance = 1,
    queryFields = ['title', 'abstract'],
    boostFields = {
      title: 2,
      abstract: 1,
    },
  } = options;
  if (term === '') {
    if (patents.length > maxNbEntries) {
      patents.length = maxNbEntries;
    }
    return patents;
  }
  const db = await create({
    schema: {
      $id: 'string',
      title: 'string',
      abstract: 'string',
    },
  });
  for (const patent of patents) {
    let article = {
      $id: patent.$id,
      title: patent.data.title || '',
      abstract: patent.data.abstract || '',
    };

    await insert(db, article);
  }
  let queryResult = await search(db, {
    term,
    properties: queryFields,
    boost: boostFields,
    relevance,
    tolerance,
  });
  //console.log(queryResult);
  let results = [];
  for (let result of queryResult.hits) {
    let id = result.document.$id;
    // todo this could be maybe improved using Map
    let patentsDocument = patents.find((patent) => patent.$id === id);
    results.push({ ...patentsDocument, score: result.score });
  }
  results = results.filter((result) => result.score >= minScore);
  if (results.length > maxNbEntries) {
    results.length = maxNbEntries;
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}
