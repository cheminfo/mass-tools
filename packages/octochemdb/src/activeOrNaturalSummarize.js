import { summarizeActivities } from './utils/summarizeActivities.js';
import { summarizePatents } from './utils/summarizePatents.js';
import { summarizePubMeds } from './utils/summarizePubMeds.js';

export async function activeOrNaturalSummarize(entry, options = {}) {
  let patents;
  let pubmeds;
  let activities;
  let promises = [];

  promises.push(
    summarizeActivities(entry, options).then((output) => {
      activities = output;
    }),
  );
  promises.push(
    summarizePatents(entry, options).then((output) => {
      patents = output;
    }),
  );
  promises.push(
    summarizePubMeds(entry, options).then((output) => {
      pubmeds = output;
    }),
  );

  await Promise.all(promises);
  let result = [];
  if (activities !== undefined) {
    result = [...result, ...activities];
  }
  if (patents !== undefined) {
    result = [...result, ...patents];
  }
  if (pubmeds !== undefined) {
    result = [...result, ...pubmeds];
  }
  result.sort((a, b) => b.score - a.score);

  return result;
}
