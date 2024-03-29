import { create, insert } from '@orama/orama';

export async function getPubmedsDB(pubmeds, options = {}) {
  const {
    queryFields = ['title', 'abstract', 'meshHeadings'],
    abstractsLimit = 1000,
    callback,
  } = options;
  if (pubmeds.length > abstractsLimit) {
    queryFields.splice(queryFields.indexOf('abstract'), 1);
  }
  const pubmedsDB = await create({
    schema: {
      $ref: 'string',
      $id: 'string',
      ...(queryFields.includes('title') ? { title: 'string' } : null),
      ...(queryFields.includes('abstract') ? { abstract: 'string' } : null),
      ...(queryFields.includes('meshHeadings')
        ? { meshHeadings: 'string[]' }
        : null),
      nbCompounds: 'number',
    },
  });

  let lastCallback = Date.now();
  for (let i = 0; i < pubmeds.length; i++) {
    const pubmed = pubmeds[i];
    if (callback && Date.now() - lastCallback > 1000) {
      lastCallback = Date.now();
      await callback('Pubmed DB creation', i, pubmeds.length);
    }
    const meshHeadings = [];
    for (const meshHeading of pubmed.data.meshHeadings) {
      if (meshHeading.descriptorName !== undefined) {
        meshHeadings.push(meshHeading.descriptorName);
      }
    }

    let article = {
      $id: pubmed.$id,
      ...(queryFields.includes('title')
        ? { title: pubmed?.data?.article?.title || '' }
        : null),
      ...(queryFields.includes('abstract')
        ? { abstract: pubmed?.data?.article?.abstract || '' }
        : null),
      ...(queryFields.includes('meshHeadings')
        ? { meshHeadings: meshHeadings || '' }
        : null),
      nbCompounds: pubmed.data.compounds.length + 2 || +2,
    };

    await insert(pubmedsDB, article);
  }
  return pubmedsDB;
}
