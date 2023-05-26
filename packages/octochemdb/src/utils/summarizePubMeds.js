import { create, insert, search } from '@orama/orama';

export async function summarizePubMeds(entry, options = {}) {
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
    let article = {
      $id: pubmeds.$id,
      url: pubmeds.url,
    };

    if (pubmeds.data.article.title) {
      article.title = pubmeds.data.article.title;
    }
    if (pubmeds.data.article.abstract) {
      article.abstract = pubmeds.data.article.abstract;
    }
    if (pubmeds.data.meshHeadings) {
      article.meshHeadings = [];
      for (const meshHeading of pubmeds.data.meshHeadings) {
        if (meshHeading.descriptorName !== undefined) {
          article.meshHeadings.push(meshHeading.descriptorName);
        }
      }
    }
    if (pubmeds.data.compounds) {
      article.nbCompounds = pubmeds.data.compounds.length;
    }
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

  return results;
}
