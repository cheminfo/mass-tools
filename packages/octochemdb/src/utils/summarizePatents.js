import { create, insert, search } from '@orama/orama';

export async function summarizePatents(entry, options = {}) {
  const db = await create({
    schema: {
      $id: 'string',
      title: 'string',
      abstract: 'string',
      url: 'string',
    },
  });
  for (const patent of entry.data.patents) {
    let article = {
      $id: patent.$id,
      url: patent.url,
    };

    if (patent.data.title) {
      article.title = patent.data.title;
    }
    if (patent.data.abstract) {
      article.abstract = patent.data.abstract;
    }
    await insert(db, article);
  }
  let queryResult = await search(db, {
    term: options.term,
    properties: options.fieldsPatent,
    boost: options.boostPatent,
  });
  let results = [];
  for (let result of queryResult.hits) {
    results.push({ score: result.score, document: result.document });
  }
  return results;
}
