import { Spectrum } from 'ms-spectrum';

import { appendFragmentsInfo } from './append/appendFragmentsInfo.js';
import { fromArray } from './from/fromArray.js';
import { fromMolecules } from './from/fromMolecules.js';
import { fromMonoisotopicMass } from './from/fromMonoisotopicMass.js';
import { fromNucleicSequence } from './from/fromNucleicSequence.js';
import { fromPeptidicSequence } from './from/fromPeptidicSequence.js';
import { fromRange } from './from/fromRange.js';
import { loadCommercials } from './loadCommercials.js';
import { loadGoogleSheet } from './loadGoogleSheet.js';
import { loadKnapSack } from './loadKnapSack.js';
import { search } from './search.js';
import { searchMSEM } from './searchMSEM.js';
import { searchSimilarity } from './searchSimilarity.js';

export * from './massShifts.js';
export * from './util/fetchJSON.js';
/**
 * A class that deals with database of monoisotopic mass and molecular formula
 */
export class EMDB {
  constructor() {
    this.databases = {};
    this.experimentalSpectrum = undefined;
  }

  /**
   *
   * @param {*} data
   * @param {object} [options={}]
   * @param {number} [options.normed=true] Should we normed (sum Y to 1) the experimental spectrum ?
   */
  setExperimentalSpectrum(data, options = {}) {
    const { normed = true } = options;
    if (normed) {
      this.experimentalSpectrum = new Spectrum(data).normedY();
    } else {
      this.experimentalSpectrum = new Spectrum(data);
    }
    return this.experimentalSpectrum;
  }

  /**
   * Add a new database using the KnapSack content
   * @param {*} options
   */
  async loadKnapSack(options = {}) {
    const { databaseName = 'knapSack', forceReload = false } = options;
    if (this.databases[databaseName] && !forceReload) return;
    this.databases[databaseName] = await loadKnapSack();
  }

  /**
   * Add a new database of 12000 commercial products
   * @param {*} options
   */
  async loadCommercials(options = {}) {
    const { databaseName = 'commercials', forceReload = false } = options;
    if (this.databases[databaseName] && !forceReload) return;
    this.databases[databaseName] = await loadCommercials();
  }

  get(databaseName) {
    return this.databases[databaseName];
  }

  /**
   * Load the contaminants database from a google sheet document
   * @param {object} [options={}]
   * @param {string} [options.databaseName='contaminants']
   * @param {string} [options.forceReload=false]
   */
  async loadContaminants(options = {}) {
    const { databaseName = 'contaminants', forceReload = false } = options;
    if (this.databases[databaseName] && !forceReload) return;
    this.databases[databaseName] = await loadGoogleSheet();
  }

  /**
   * Load a google sheet containing MF information
   * @param {object} [options={}]
   * @param {string} [options.databaseName='sheet']
   * @param {string} [options.forceReload=false]
   */

  async loadGoogleSheet(options = {}) {
    const { databaseName = 'sheet', forceReload = false } = options;
    if (this.databases[databaseName] && !forceReload) return;
    this.databases[databaseName] = await loadGoogleSheet();
  }

  async loadTest() {
    await this.fromArray(['C1-100'], {
      databaseName: 'test',
      ionizations: '+',
    });
  }

  async loadNeutralTest(options = {}) {
    const { maxC = 100 } = options;
    await this.fromArray([`C1-${maxC}`], { databaseName: 'test' });
  }

  async fromMonoisotopicMass(mass, options = {}) {
    const { databaseName = 'monoisotopic', append = false } = options;
    let result = await fromMonoisotopicMass(mass, options);
    replaceOrAppend(this, databaseName, result.mfs, append);
    return result;
  }

  async fromArray(sequence, options = {}) {
    const { databaseName = 'generated', append = false, estimate } = options;
    const results = await fromArray(sequence, options);
    if (estimate) return results;
    replaceOrAppend(this, databaseName, results, append);
  }

  async fromMolecules(entries, ocl, options = {}) {
    const { databaseName = 'molecules', append = false } = options;
    const results = await fromMolecules(entries, ocl, options);
    replaceOrAppend(this, databaseName, results, append);
  }

  async fromRange(sequence, options = {}) {
    const { databaseName = 'generated', append = false, estimate } = options;
    const results = await fromRange(sequence, options);
    if (estimate) return results;
    replaceOrAppend(this, databaseName, results, append);
  }

  async fromPeptidicSequence(sequence, options = {}) {
    const { databaseName = 'peptidic', append = false, estimate } = options;
    const results = await fromPeptidicSequence(sequence, options);
    if (estimate) return results;
    replaceOrAppend(this, databaseName, results, append);
  }

  /**
   *
   * @param {string} databaseName
   * @param {object} [options={}]
   * @param {number} [options.precision=100]
   * @param {string} [options.ionizations='']
   * @returns
   */
  async appendFragmentsInfo(databaseName, options = {}) {
    const database = this.databases[databaseName];
    await appendFragmentsInfo(this.experimentalSpectrum, database, options);
    return database;
  }

  async fromNucleicSequence(sequence, options = {}) {
    const { databaseName = 'nucleic', append = false, estimate } = options;
    const results = await fromNucleicSequence(sequence, options);
    if (estimate) return results;
    replaceOrAppend(this, databaseName, results, append);
  }

  listDatabases() {
    return Object.keys(this.databases).sort();
  }

  getInfo() {
    return {
      databases: Object.keys(this.databases)
        .sort()
        .map((key) => {
          return { name: key, nbEntries: this.databases[key].length };
        }),
    };
  }

  search(filter, options = {}) {
    return search(this, filter, options);
  }

  searchMSEM(filter, options = {}) {
    return searchMSEM(this, filter, options);
  }

  searchSimilarity(options = {}) {
    return searchSimilarity(this, options);
  }
}

function replaceOrAppend(emdb, databaseName, results, append = false) {
  if (!emdb.databases[databaseName] || !append) {
    emdb.databases[databaseName] = results;
    return;
  }
  emdb.databases[databaseName] = emdb.databases[databaseName].concat(results);
}
