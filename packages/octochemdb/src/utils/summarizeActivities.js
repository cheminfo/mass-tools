import { create, insert, search } from '@orama/orama';
/**
 * @param {object[]} activities
 * @param {string} term
 * @param {object} [options={}]
 * @param {number} [options.minScore=0.5]
 * @param {number} [options.maxEntries=50]
 * @param {object} [options.relevance={ k: 1.2, b: 0.75, d: 0.5 }]
 * @param {number} [options.tolerance=1]
 * @param {string[]} [options.fields=['assay']]
 */
export async function summarizeActivities(activities, term = "", options = {}) {
  const {
    maxEntries = 100,
    minScore = 0.5,
    relevance = { k: 1.2, b: 0.75, d: 0.5 },
    tolerance = 1,
    fields = ['assay'],
  } = options;
  const db = await create({
    schema: {
      $id: 'string',
      assay: 'string',
      url: 'string',
    },
  });
  for (const activity of activities) {
    let assay = {
      $id: activity.$id,
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
        };
      }
    }
  }
  let queryResult = await search(db, {
    term,
    relevance,
    properties: fields,
    tolerance,
  });
  let results = [];
  for (let result of queryResult.hits) {
    let id = result.document.$id;
    let assay = result.document.assay;
    let activityDocument = activities.find((activity) => activity.$id === id);
    activityDocument = activityDocument.data.activities.find(
      (activity) => activity.assay === assay,
    );
    results.push({ ...activityDocument, score: result.score });
  }
  results = results.filter((result) => result.score >= minScore);
  if (results.length > maxEntries) {
    results.length = maxEntries;
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}
