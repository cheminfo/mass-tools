import { summarizeActivities } from './utils/summarizeActivities.js';
import { summarizePatents } from './utils/summarizePatents.js';
import { summarizePubMeds } from './utils/summarizePubMeds.js';
/**
 * @description This function summarizes the activities, patents and pubmeds of an entry of ActivesOrNaturals collection.
 * @param {object} entry - an entry of ActivesOrNaturals collection
 * @param {string} term - Search term
 * @param {object} options - Options
 * @param {object} [options.activities={}] - Options for activities
 * @param {number} [options.activities.minScore=0.5] - Minimum score for an entry to be returned
 * @param {number} [options.activities.maxNbEntries=50] - Maximum number of entries to return
 * @param {object} [options.activities.relevance={ k: 1.2, b: 0.75, d: 0.5 }] - BM25 algorithm {k: Term frequency saturation parameter, b: Length normalization parameter, d:Frequency normalization lower bound}
 * @param {number} [options.activities.tolerance=1] -Typo Tolerance following the Levenshtein algorithm
 * @param {string[]} [options.queryFields=['assay']] - Fields to query
 * @param {object} [options.patents={}] - Options for patents
 * @param {object} [options.pubmeds={}] - Options for pubmeds
 * @returns {Promise<Object>} - Summarized entry of ActivesOrNaturals collection
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
