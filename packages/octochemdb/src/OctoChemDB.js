
import { mfsFromEM } from "./mfsFromEM.js";

export class OctoChemDB {
  constructor(options = {}) {
    this.url = options.url ?? 'https://octochemdb.cheminfo.org/';
  }


  async mfsFromEMs(masses, options = {}) {
    return mfsFromEM(masses, { url: this.url, ...options });
  }
}
