import { create, insert } from '@orama/orama';

export async function getPatentsDB(patents, options = {}) {
  const {
    queryFields = ['title', 'abstract'],
    abstractsLimit = 1000,
    callback,
  } = options;
  if (patents.length > abstractsLimit) {
    queryFields.splice(queryFields.indexOf('abstract'), 1);
  }
  const patentsDB = await create({
    schema: {
      $id: 'string',
      ...(queryFields.includes('title') ? { title: 'string' } : null),
      ...(queryFields.includes('abstract') ? { abstract: 'string' } : null),
      nbCompounds: 'number',
    },
  });
  let lastCallback = Date.now();
  for (let i = 0; i < patents.length; i++) {
    const patent = patents[i];
    if (callback && Date.now() - lastCallback > 1000) {
      lastCallback = Date.now();
      await callback('Patent DB creation', i, patents.length);
    }
    let article = {
      $id: patent.$id,
      ...(queryFields.includes('title')
        ? { title: patent?.data?.title }
        : null),
      ...(queryFields.includes('abstract')
        ? { abstract: patent?.data?.abstract }
        : null),
      nbCompounds: patent.data.nbCompounds + 2 || +2,
    };

    await insert(patentsDB, article);
  }
  return patentsDB;
}
