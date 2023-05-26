import { create, insert, search } from '@orama/orama';

/**
 *
 * @param {object[]} pubmeds
 * @param {string} term
 * @param {object} [options={}]
 * @param {number} [options.minScore=0.5]
 * @param {number} [options.maxNbEntries=50]
 * @param {object} [options.relevance={ k: 1.2, b: 0.75, d: 0.5 }]
 * @param {number} [options.tolerance=1]
 * @param {object} [options.boostFields={ title: 2, abstract: 1, meshHeadings: 1 }]
 * @param {string[]} [options.fields=['title', 'abstract', 'meshHeadings']]
 * @returns
 */
export async function summarizePubMeds(pubmeds, term = "", options = {}) {
  const {
    maxNbEntries = 100,
    minScore = 0.5,
    relevance = { k: 1.2, b: 0.75, d: 0.5 },
    tolerance = 1,
    fields = ['title', 'abstract', 'meshHeadings'],
    boostFields = {
      title: 2,
      abstract: 1,
      meshHeadings: 1,
    },
  } = options;

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
      nbCompounds: pubmed.data.compounds.length || 0,
    };

    await insert(db, article);
  }
  let queryResult = await search(db, {
    term,
    properties: fields,
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
