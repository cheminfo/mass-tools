import { activeOrNaturalDetails } from './activeOrNaturalDetails.js';
import { activesOrNaturals } from './activesOrNaturals.js';
import { activesOrNaturalsByMF } from './activesOrNaturalsByMF.js';
import { compoundsFromMF } from './compoundsFromMF.js';
import { massSpectra } from './massSpectra.js';
import { mfsFromEMs } from './mfsFromEMs.js';
import { pubmedCompounds } from './pubmedCompounds.js';
import { searchInSilicoSpectra } from './searchInSilicoSpectra.js';
import { searchMasses } from './searchMasses.js';

export class OctoChemDB {
  /**
   *
   * @param {*} options
   */
  constructor(options = {}) {
    this.baseURL = options.baseURL ?? 'https://octochemdb.cheminfo.org/';
  }

  async mfsFromEMs(masses, options = {}) {
    return mfsFromEMs(masses, { baseURL: this.baseURL, ...options });
  }

  async compoundsFromMF(mf, options = {}) {
    return compoundsFromMF(mf, { baseURL: this.baseURL, ...options });
  }

  async activesOrNaturals(options = {}) {
    return activesOrNaturals({ baseURL: this.baseURL, ...options });
  }

  async activesOrNaturalsByMF(options = {}) {
    return activesOrNaturalsByMF({ baseURL: this.baseURL, ...options });
  }

  async activeOrNaturalDetails(id, options = {}) {
    return activeOrNaturalDetails(id, { baseURL: this.baseURL, ...options });
  }

  async searchMasses(options = {}) {
    return searchMasses({ baseURL: this.baseURL, ...options });
  }

  async massSpectra(options = {}) {
    return massSpectra({ baseURL: this.baseURL, ...options });
  }

  async searchInSilicoSpectra(options = {}) {
    return searchInSilicoSpectra({ baseURL: this.baseURL, ...options });
  }

  async pubmedCompounds(pubmedID, options = {}) {
    return pubmedCompounds(pubmedID, { baseURL: this.baseURL, ...options });
  }
}
