import { activeOrNaturalDetails } from './activeOrNaturalDetails.js';
import { activesOrNaturals } from './activesOrNaturals.js';
import { activesOrNaturalsByMF } from './activesOrNaturalsByMF.js';
import { gnps } from './gnps.js';
import { massBank } from './massBank.js';
import { massSpectra } from './massSpectra.js';
import { mfsFromEM } from './mfsFromEM.js';

export class OctoChemDB {
  /**
   *
   * @param {*} options
   */
  constructor(options = {}) {
    this.baseURL = options.baseURL ?? 'https://octochemdb.cheminfo.org/';
  }

  async mfsFromEMs(masses, options = {}) {
    return mfsFromEM(masses, { baseURL: this.baseURL, ...options });
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

  async gnps(options = {}) {
    return gnps({ baseURL: this.baseURL, ...options });
  }

  async massBank(options = {}) {
    return massBank({ baseURL: this.baseURL, ...options });
  }

  async massSpectra(options = {}) {
    return massSpectra({ baseURL: this.baseURL, ...options });
  }


}
