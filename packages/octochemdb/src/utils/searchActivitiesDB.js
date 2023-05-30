import { search } from '@orama/orama';

export async function searchActivitiesDB(
  activitiesDB,
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
    throw new Error('terms is empty');
  }
  let queryResult = await search(activitiesDB, {
    term: terms,
    relevance,
    properties: queryFields,
    tolerance,
  });
  let results = [];

  for (let result of queryResult.hits) {
    let id = result.document.$id;
    let assay = result.document.assay;
    let activityDocument = activities.find((activity) => {
      return activity.$id === id && activity.data.assay === assay;
    });

    results.push({ ...activityDocument, score: result.score });
  }
  results = results.filter((result) => result.score >= minScore);
  if (results.length > maxNbEntries) {
    results.length = maxNbEntries;
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}
