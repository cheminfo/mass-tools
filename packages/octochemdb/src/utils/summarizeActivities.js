import { create, insert, search } from '@orama/orama';

export async function summarizeActivities(entry, options = {}) {
  const db = await create({
    schema: {
      $id: 'string',
      assay: 'string',
      url: 'string',
    },
  });
  for (const activity of entry.data.activities) {
    let assay = {
      $id: activity.$id,
      url: activity.url,
    };

    if (activity.data?.assay) {
      assay.assay = activity.data.assay;
      await insert(db, assay);
      continue;
    }
    if (activity.data?.activities) {
      for (const active of activity.data.activities) {
        assay.assay = active.assay;

        await insert(db, assay);

        assay = {
          $id: activity.$id,
          url: activity.url,
        };
      }
    }
  }
  let queryResult = await search(db, {
    term: options.term,
    properties: options.fieldsActivities,
  });

  let results = [];
  for (let result of queryResult.hits) {
    results.push({ score: result.score, document: result.document });
  }

  return results;
}
