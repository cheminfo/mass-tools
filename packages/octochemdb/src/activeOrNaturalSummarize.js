import { summarizeActivities } from './utils/summarizeActivities.js';
import { summarizePatents } from './utils/summarizePatents.js';
import { summarizePubMeds } from './utils/summarizePubMeds.js';
/**
 *
 * @param {object} entry
 * @param {string} term
 * @param {object} options
 * @param {object} [options.activities]
 * @param {object} [options.patents]
 * @param {object} [options.pubmeds]
 * @returns
 */
export async function activeOrNaturalSummarize(entry, term, options = {}) {
  entry = { ...entry };

  let promises = [];

  promises.push(
    summarizeActivities(entry.data.activities, term, options.activities).then(
      (activities) => {
        entry.data.activities = activities;
      },
    ),
  );
  promises.push(
    summarizePatents(entry.data.patents, term, options.patents).then(
      (patents) => {
        entry.data.patents = patents;
      },
    ),
  );

  promises.push(
    summarizePubMeds(entry.data.pubmeds, term, options.pubmeds).then(
      (pubmeds) => {
        entry.data.pubmeds = pubmeds;
      },
    ),
  );

  await Promise.all(promises);
  return entry;
}
