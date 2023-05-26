import { create, insert, search } from '@orama/orama';

/**
 *
 * @param {object} entry
 * @param {string} term
 * @param {object} [options={}]
 * @param {number} [options.minScore=0.5]
 * @param {number} [options.maxNbEntries=50]
 * @returns
 */
export async function summarizePubMeds(entry, term, options = {}) {

  const { maxNbEntries = 100, minScore = 0.5 } = options

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
  for (const pubmeds of entry.data.pubmeds) {

    const meshHeadings = [];
    for (const meshHeading of pubmeds.data.meshHeadings) {
      if (meshHeading.descriptorName !== undefined) {
        meshHeadings.push(meshHeading.descriptorName);
      }
    }

    let article = {
      $id: pubmeds.$id,
      url: pubmeds.url,
      title: pubmeds.data.article.title || "",
      abstract: pubmeds.data.article.abstract || "",
      meshHeadings,
      nbCompounds: pubmeds.data.compounds.length || 0
    };

    await insert(db, article);
  }
  let queryResult = await search(db, {
    term: options.term,
    properties: options.fieldsPubMed,
    boost: options.boostPubMed,
    relevance: options.relevance,
  });
  queryResult.hits.map((item) => {
    let nbCompounds = 2;
    if (item.document.nbCompounds) {
      nbCompounds = +Number(item.document.nbCompounds);
    }
    item.score = item.score / Math.log2(nbCompounds);

    return item;
  });
  queryResult.hits.sort((a, b) => b.score - a.score);

  let results = [];
  for (let result of queryResult.hits) {
    results.push({ score: result.score, document: result.document });
  }

  results = results.filter(result => result.score >= minScore)
  if (results.length > maxNbEntries) {
    results.length = maxNbEntries;
  }
  return results;
}
