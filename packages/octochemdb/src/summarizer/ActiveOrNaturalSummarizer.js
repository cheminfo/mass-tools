import { getActivitiesDB } from './utils/getActivitiesDB';
import { getPatentsDB } from './utils/getPatentsDB';
import { getPubmedsDB } from './utils/getPubmedsDB';
import { searchActivitiesDB } from './utils/searchActivitiesDB';
import { searchPatentsDB } from './utils/searchPatentsDB';
import { searchPubmedsDB } from './utils/searchPubmedsDB';
import { summarizeEmptyTerms } from './utils/summarizeEmptyTerms';

export class ActiveOrNaturalSummarizer {
  /**
   * @description Summarize the active or natural details with the given terms
   * @param {Object} activeOrNaturalDetails The active or natural details to summarize
   * @param {Object} [options={}] The options to use for the search
   * @param {Object} [options.activities={}] The options to use for the activities search
   * @param {number} [options.activities.minScore=0.5] - Minimum score for an entry to be returned
   * @param {number} [options.activities.maxNbEntries=50] - Maximum number of entries to return
   * @param {object} [options.activities.relevance={ k: 1.2, b: 0.75, d: 0.5 }] - BM25 algorithm {k: Term frequency saturation parameter, b: Length normalization parameter, d:Frequency normalization lower bound}
   * @param {number} [options.activities.tolerance=1] -Typo Tolerance following the Levenshtein algorithm
   * @param {string[]} [options.queryFields=['assay']] - Fields to query
   * @param {object} [options.patents={}] - Options for patents
   * @param {number} [options.patents.abstractsLimit=1000] - If more than this number of abstracts, the search will be done on the without abstracts
   * @param {number} [options.patents.maxNbEntries=100] - Maximum number of entries to return
   * @param {number} [options.patents.inScore=0.5] - Minimum score for an entry to be returned
   * @param {object} [options.patents.relevance={ k: 1.2, b: 0.75, d: 0.5 }] - BM25 algorithm {k: Term frequency saturation parameter, b: Length normalization parameter, d:Frequency normalization lower bound}
   * @param {number} [options.patents.tolerance=1] -Typo Tolerance following the Levenshtein algorithm
   * @param {string[]} [options.patents.queryFields=['title', 'abstract']] - Fields to query
   * @param {object} [options.patents.boostFields={ title: 2, abstract: 1 }] - Fields weights, higher weight means higher importance
   * @param {object} [options.pubmeds={}] - Options for pubmeds
   * @param {number} [options.pubmeds.abstractsLimit=1000] - If more than this number of abstracts, the search will be done on the without abstracts
   * @param {number} [options.pubmeds.minScore=0.5] - Minimum score for an entry to be returned
   * @param {number} [options.pubmeds.maxNbEntries=50] - Maximum number of entries to return
   * @param {object} [options.pubmeds.relevance={ k: 1.2, b: 0.75, d: 0.5 }] - BM25 algorithm {k: Term frequency saturation parameter, b: Length normalization parameter, d:Frequency normalization lower bound}
   * @param {number} [options.pubmeds.tolerance=1] -Typo Tolerance following the Levenshtein algorithm
   * @param {object} [options.pubmeds.boostFields={ title: 2, abstract: 1, meshHeadings: 1 }]  - Fields weights, higher weight means higher importance
   * @param {string[]} [options.pubmeds.queryFields=['title', 'abstract', 'meshHeadings']] - Fields to query
   * @returns
   */
  constructor(activeOrNaturalDetails, options = {}) {
    this.options = options;
    this.activeOrNaturalDetails = activeOrNaturalDetails;
    this.activities = activeOrNaturalDetails.data.activities;
    this.patents = activeOrNaturalDetails.data.patents;
    this.pubmeds = activeOrNaturalDetails.data.pubmeds;
    this.isInitialized = false;
  }
  /**
   * @description Summarize the active or natural details with the given terms
   * @param {string} terms The terms to search
   * @returns {Promise<Object>} The summarized active or natural details
   */
  async summarize(terms) {
    if (terms === '') {
      const { patents, pubmeds, activities } = summarizeEmptyTerms(
        this.activities,
        this.patents,
        this.pubmeds,
        this.options,
      );
      return {
        ...this.activeOrNaturalDetails,
        data: {
          ...this.activeOrNaturalDetails.data,
          activities,
          patents,
          pubmeds,
        },
      };
    }
    if (!this.isInitialized) {
      await this.createDB();
      this.isInitialized = true;
    }

    return {
      ...this.activeOrNaturalDetails,
      data: {
        ...this.activeOrNaturalDetails.data,
        activities: await searchActivitiesDB(
          this.activitiesDB,
          this.activities,
          terms,
          this.options?.activities,
        ),
        patents: await searchPatentsDB(
          this.patentsDB,
          this.patents,
          terms,
          this.options?.patents,
        ),
        pubmeds: await searchPubmedsDB(
          this.pubmedsDB,
          this.pubmeds,
          terms,
          this.options?.pubmeds,
        ),
      },
    };
  }

  async createDB() {
    this.pubmedsDB = await getPubmedsDB(this.pubmeds, this.options.pubmeds);
    this.activitiesDB = await getActivitiesDB(
      this.activities,
      this.options.activities,
    );
    this.patentsDB = await getPatentsDB(this.patents, this.options.patents);
  }
}
