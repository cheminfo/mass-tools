import { get } from "http";

export class ActiveOrNaturalSummarizer {
  constructor(activeOrNaturalDetails, options = {}) {
    const { patents, pubmeds, activities } = options;
    this.activeOrNaturalDetails = activeOrNaturalDetails
  }

  summarize(terms) {
    if (!terms) return this.activeOrNaturalDetails;


    this.pubmedsDB.search(terms);
  }

  createDB(options) {
    this.pubmedsDB = getPubmedsDB(pubmeds);
    this.activitiesDB = getActivitiesDB(activities);
    this.patentsDB = getPatentsDB(patents);
  }

}

const activeOrNaturalSummarizer = new ActiveOrNaturalSummarizer(details);
const summarized = activeOrNaturalSummarizer.summarize('cancer')
