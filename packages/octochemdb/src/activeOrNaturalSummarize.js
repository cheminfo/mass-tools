import { summarizeActivities } from './utils/summarizeActivities.js';
import { summarizePatents } from './utils/summarizePatents.js';
import { summarizePubMeds } from './utils/summarizePubMeds.js';

export async function activeOrNaturalSummarize(entry, term, options = {}) {


  entry = { ...entry }

  let promises = [];

  promises.push(
    summarizeActivities(entry.activities, options).then((activities) => {
      entry.activities = activities;
    }),
  );
  promises.push(
    summarizePatents(entry.patents, options.patents).then((patents) => {
      entry.patents = patents;
    }),
  );
  promises.push(
    summarizePubMeds(entry, options).then((pubmeds) => {
      entry.pubmeds = pubmeds;
    }),
  );

  await Promise.all(promises);

  return entry
}
