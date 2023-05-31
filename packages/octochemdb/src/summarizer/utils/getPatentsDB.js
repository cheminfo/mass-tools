import { create, insert } from '@orama/orama';

export async function getPatentsDB(patents, options = {}) {
  const { queryFields = ['title', 'abstract'] } = options;
  const patentsDB = await create({
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
