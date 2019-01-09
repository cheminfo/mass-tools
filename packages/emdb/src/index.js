'use strict';

const loadKnapSackPromise = require('./loadKnapSack');
const loadGoogleSheetPromise = require('./loadGoogleSheet');
const loadCommercialsPromise = require('./loadCommercials');
const Spectrum = require('./spectrum/Spectrum');

function DBManager() {
  this.databases = {};
  this.experimentalSpectrum = undefined;
}

DBManager.prototype.setExperimentalSpectrum = function setExperimentalSpectrum(
  data
) {
  this.experimentalSpectrum = new Spectrum(data).normedY();
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
  options = {}
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
  options = {}
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
  options = {}
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
  options = {}
) {
  const { databaseName = 'monoisotopic' } = options;
  let result = require('./fromMonoisotopicMass')(mass, options);
  this.databases[databaseName] = result.mfs;
  return result;
};

DBManager.prototype.fromArray = function fromArray(sequence, options = {}) {
  const { databaseName = 'generated' } = options;
  this.databases[databaseName] = require('./fromArray')(sequence, options);
};

DBManager.prototype.fromPeptidicSequence = function fromPeptidicSequence(
  sequence,
  options = {}
) {
  const { databaseName = 'peptidic' } = options;
  this.databases[databaseName] = require('./fromPeptidicSequence')(
    sequence,
    options
  );
};

DBManager.prototype.fromNucleicSequence = function fromNucleicSequence(
  sequence,
  options = {}
) {
  const { databaseName = 'nucleic' } = options;
  this.databases[databaseName] = require('./fromNucleicSequence')(
    sequence,
    options
  );
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
      })
  };
};

DBManager.prototype.search = require('./search');
DBManager.prototype.searchMSEM = require('./searchMSEM');
DBManager.prototype.searchPubchem = require('./searchPubchem');
DBManager.prototype.searchSimilarity = require('./searchSimilarity');

module.exports = DBManager;
