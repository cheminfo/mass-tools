import { create, insert, search } from '@orama/orama';
/**
 * @description This function performs a search on a list of activities and returns the most relevant ones using the BM25 algorithm.
 * @param {object[]} activities - Activities to summarize
 * @param {string} terms - Search terms
 * @param {object} [options={}] - Options
 * @param {number} [options.minScore=0.5] - Minimum score for an entry to be returned
 * @param {number} [options.maxNbEntries=50] - Maximum number of entries to return
 * @param {object} [options.relevance={ k: 1.2, b: 0.75, d: 0.5 }] - BM25 algorithm {k: Term frequency saturation parameter, b: Length normalization parameter, d:Frequency normalization lower bound}
 * @param {number} [options.tolerance=1] -Typo Tolerance following the Levenshtein algorithm
 * @param {string[]} [options.queryFields=['assay']] - Fields to query
 */
export async function summarizeActivities(
  activities,
  terms = '',
  options = {},
) {
  const {
    maxNbEntries = 100,
    minScore = 0.5,
    relevance = { k: 1.2, b: 0.75, d: 0.5 },
    tolerance = 1,
    queryFields = ['assay'],
  } = options;

  if (terms === '') {
    if (activities.length > maxNbEntries) {
      activities.length = maxNbEntries;
    }
    return activities;
  }
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
    term: terms,
    relevance,
    properties: queryFields,
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
  if (results.length > maxNbEntries) {
    results.length = maxNbEntries;
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}
