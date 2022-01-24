'use strict';

const { Spectrum } = require('ms-spectrum');

const loadCommercialsPromise = require('./loadCommercials.js');
const loadGoogleSheetPromise = require('./loadGoogleSheet.js');
const loadKnapSackPromise = require('./loadKnapSack.js');

function DBManager() {
  this.databases = {};
  this.experimentalSpectrum = undefined;
}

/**
 *
 * @param {*} data
 * @param {object} [options={}]
 * @param {number} [options.normed=true] Should we normed (sum Y to 1) the experimental spectrum ?
 */
DBManager.prototype.setExperimentalSpectrum = function setExperimentalSpectrum(
  data,
  options = {},
) {
  const { normed = true } = options;
  if (normed) {
    this.experimentalSpectrum = new Spectrum(data).normedY();
  } else {
    this.experimentalSpectrum = new Spectrum(data);
  }
  return this.experimentalSpectrum;
};

/**
 * Add a new database using the KnapSack content
 * @param {*} options
 */
DBManager.prototype.loadKnapSack = async function loadKnapSack(options = {}) {
  const { databaseName = 'knapSack', forceReload = false } = options;
  if (this.databases[databaseName] && !forceReload) return;
  this.databases[databaseName] = await loadKnapSackPromise();
};

/**
 * Add a new database of 12000 commercial products
 * @param {*} options
 */
DBManager.prototype.loadCommercials = async function loadCommercials(
  options = {},
) {
  const { databaseName = 'commercials', forceReload = false } = options;
  if (this.databases[databaseName] && !forceReload) return;
  this.databases[databaseName] = await loadCommercialsPromise();
};

DBManager.prototype.get = function get(databaseName) {
  return this.databases[databaseName];
};

/**
 * Load the contaminants databvase from a google sheet document
 * @param {*} options
 * @param {string} ['contaminants'] databaseName
 */
DBManager.prototype.loadContaminants = async function loadContaminants(
  options = {},
) {
  const { databaseName = 'contaminants', forceReload = false } = options;
  if (this.databases[databaseName] && !forceReload) return;
  this.databases[databaseName] = await loadGoogleSheetPromise();
};

/**
 * Load a google sheet containin
 * @param {*} options
 * @param {string} ['sheet'] databaseName
 */

DBManager.prototype.loadGoogleSheet = async function loadGoogleSheet(
  options = {},
) {
  const { databaseName = 'sheet', forceReload = false } = options;
  if (this.databases[databaseName] && !forceReload) return;
  this.databases[databaseName] = await loadGoogleSheetPromise();
};

DBManager.prototype.loadTest = function loadTest() {
  this.fromArray(['C1-100'], { databaseName: 'test', ionizations: '+' });
};

DBManager.prototype.loadNeutralTest = function loadNeutralTest(options = {}) {
  const { maxC = 100 } = options;
  this.fromArray([`C1-${maxC}`], { databaseName: 'test' });
};

DBManager.prototype.fromMonoisotopicMass = function fromMonoisotopicMass(
  mass,
  options = {},
) {
  const { databaseName = 'monoisotopic', append = false } = options;
  let result = require('./from/fromMonoisotopicMass')(mass, options);
  replaceOrAppend(this, databaseName, result.mfs, append);
  return result;
};

DBManager.prototype.fromArray = function fromArray(sequence, options = {}) {
  const { databaseName = 'generated', append = false, estimate } = options;
  const results = require('./from/fromArray')(sequence, options);
  if (estimate) return results;
  replaceOrAppend(this, databaseName, results, append);
};

DBManager.prototype.fromRange = function fromRange(sequence, options = {}) {
  const { databaseName = 'generated', append = false, estimate } = options;
  const results = require('./from/fromRange')(sequence, options);
  if (estimate) return results;
  replaceOrAppend(this, databaseName, results, append);
};

DBManager.prototype.fromPeptidicSequence = function fromPeptidicSequence(
  sequence,
  options = {},
) {
  const { databaseName = 'peptidic', append = false, estimate } = options;
  const results = require('./from/fromPeptidicSequence')(sequence, options);
  if (estimate) return results;
  replaceOrAppend(this, databaseName, results, append);
};

/**
 *
 * @param {string} databaseName
 * @param {object} [options={}]
 * @param {number} [options.precision=100]
 * @param {string} [options.ionizations='']
 * @returns
 */
DBManager.prototype.appendFragmentsInfo = function appendFragmentsInfo(
  databaseName,
  options = {},
) {
  const database = this.databases[databaseName];
  require('./append/appendFragmentsInfo')(
    this.experimentalSpectrum,
    database,
    options,
  );
  return database;
};

DBManager.prototype.fromNucleicSequence = function fromNucleicSequence(
  sequence,
  options = {},
) {
  const { databaseName = 'nucleic', append = false, estimate } = options;
  const results = require('./from/fromNucleicSequence')(sequence, options);
  if (estimate) return results;
  replaceOrAppend(this, databaseName, results, append);
};

DBManager.prototype.listDatabases = function listDatabases() {
  return Object.keys(this.databases).sort();
};

DBManager.prototype.getInfo = function getInfo() {
  return {
    databases: Object.keys(this.databases)
      .sort()
      .map((key) => {
        return { name: key, nbEntries: this.databases[key].length };
      }),
  };
};

DBManager.prototype.massShifts = require('./massShifts');
DBManager.prototype.search = require('./search');
DBManager.prototype.searchMSEM = require('./searchMSEM');
DBManager.prototype.searchPubchem = require('./searchPubchem');
DBManager.prototype.searchSimilarity = require('./searchSimilarity');

module.exports = DBManager;

function replaceOrAppend(emdb, databaseName, results, append = false) {
  if (!emdb.databases[databaseName] || !append) {
    emdb.databases[databaseName] = results;
    return;
  }
  emdb.databases[databaseName] = emdb.databases[databaseName].concat(results);
}

DBManager.Peptide = require('peptide');
DBManager.Nucleotide = require('nucleotide');
DBManager.MFParser = require('mf-parser');
DBManager.IsotopicDistribution = require('isotopic-distribution');
