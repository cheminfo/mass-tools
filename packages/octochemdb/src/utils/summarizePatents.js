import { create, insert, search } from '@orama/orama';
/**
 *
 * @param {object[]} patents
 * @param {string} term
 * @param {object} options
 * @param {number} [options.maxNbEntries=100]
 * @param {number} [options.minScore=0.5]
 * @param {object} [options.relevance={ k: 1.2, b: 0.75, d: 0.5 }]
 * @param {number} [options.tolerance=1]
 * @param {string[]} [options.queryFields=['title', 'abstract']]
 * @param {object} [options.boostFields={ title: 2, abstract: 1 }]
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
