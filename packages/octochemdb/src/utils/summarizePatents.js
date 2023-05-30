import { create, insert, search } from '@orama/orama';
/**
 * @description This function performs a search on a list of patents and returns the most relevant ones using the BM25 algorithm.
 * @param {object[]} patents - Patents to summarize
 * @param {string} terms - Search terms
 * @param {object} options - Options
 * @param {number} [options.maxNbEntries=100] - Maximum number of entries to return
 * @param {number} [options.minScore=0.5] - Minimum score for an entry to be returned
 * @param {object} [options.relevance={ k: 1.2, b: 0.75, d: 0.5 }] - BM25 algorithm {k: Term frequency saturation parameter, b: Length normalization parameter, d:Frequency normalization lower bound}
 * @param {number} [options.tolerance=1] -Typo Tolerance following the Levenshtein algorithm
 * @param {string[]} [options.queryFields=['title', 'abstract']] - Fields to query
 * @param {object} [options.boostFields={ title: 2, abstract: 1 }] - Fields weights, higher weight means higher importance
 * @returns
 */
export async function summarizePatents(patents, terms = '', options = {}) {
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
  if (terms === '') {
    if (patents.length > maxNbEntries) {
      patents.length = maxNbEntries;
    }
    patents.sort((a, b) => {
      const nbCompoundsEntryA = a.data.nbCompounds + 2 || 2;
      const nbCompoundsEntryB = b.data.nbCompounds + 2 || 2;
      return (
        1 / Math.log2(nbCompoundsEntryB) - 1 / Math.log2(nbCompoundsEntryA)
      );
    });
    return patents;
  }

  const db = await create({
    schema: {
      $id: 'string',
      ...(queryFields.includes('title') ? { title: 'string' } : null),
      ...(queryFields.includes('abstract') ? { abstract: 'string' } : null),
      nbCompounds: 'number',
    },
  });
  for (const patent of patents) {
    let article = {
      $id: patent.$id,
      ...(queryFields.includes('title') ? { title: patent.data.title } : null),
      ...(queryFields.includes('abstract')
        ? { abstract: patent.data.abstract }
        : null),
      nbCompounds: patent.data.nbCompounds + 2 || +2,
    };

    await insert(db, article);
  }
  let queryResult = await search(db, {
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
    // to do this could be maybe improved using Map
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
