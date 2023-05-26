import { create, insert, search } from '@orama/orama';

/**
 * @description This function performs a search on a list of PubMed articles and returns the most relevant ones using the BM25 algorithm. Articles related to less compounds are prioritized.
 * @param {object[]} pubmeds - Pubmeds to summarize
 * @param {string} term - Search term
 * @param {object} [options={}] - Options
 * @param {number} [options.minScore=0.5] - Minimum score for an entry to be returned
 * @param {number} [options.maxNbEntries=50] - Maximum number of entries to return
 * @param {object} [options.relevance={ k: 1.2, b: 0.75, d: 0.5 }] - BM25 algorithm {k: Term frequency saturation parameter, b: Length normalization parameter, d:Frequency normalization lower bound}
 * @param {number} [options.tolerance=1] -Typo Tolerance following the Levenshtein algorithm
 * @param {object} [options.boostFields={ title: 2, abstract: 1, meshHeadings: 1 }]  - Fields weights, higher weight means higher importance
 * @param {string[]} [options.queryFields=['title', 'abstract', 'meshHeadings']] - Fields to query
 * @returns
 */
export async function summarizePubMeds(pubmeds, term = '', options = {}) {
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
  } = options;
  if (term === '') {
    if (pubmeds.length > maxNbEntries) {
      pubmeds.length = maxNbEntries;
    }
    pubmeds.sort((a, b) => {
      const nbCompoundsEntryA = a.data.compounds.length + 2 || 2;
      const nbCompoundsEntryB = b.data.compounds.length + 2 || 2;
      return (
        1 / Math.log2(nbCompoundsEntryB) - 1 / Math.log2(nbCompoundsEntryA)
      );
    });
    return pubmeds;
  }
  const db = await create({
    schema: {
      $ref: 'string',
      $id: 'string',
      title: 'string',
      abstract: 'string',
      nbCompounds: 'number',
      meshHeadings: 'string[]',
    },
  });
  for (const pubmed of pubmeds) {
    const meshHeadings = [];
    for (const meshHeading of pubmed.data.meshHeadings) {
      if (meshHeading.descriptorName !== undefined) {
        meshHeadings.push(meshHeading.descriptorName);
      }
    }

    let article = {
      $id: pubmed.$id,
      url: pubmed.url,
      title: pubmed.data.article.title || '',
      abstract: pubmed.data.article.abstract || '',
      meshHeadings,
      nbCompounds: pubmed.data.compounds.length + 2 || +2,
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
