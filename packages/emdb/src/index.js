'use strict';

const loadKnapSackPromise = require('./loadKnapSack');
const loadGoogleSheetPromise = require('./loadGoogleSheet');
const loadCommercialsPromise = require('./loadCommercials');


function DBManager() {
    this.databases = {};
    this.experimentalSpectrum = undefined;
}

DBManager.prototype.setExperimentalSpectrum = function setExperimentalSpectrum(experimentalSpectrum) {
    this.experimentalSpectrum = experimentalSpectrum;
};

/**
 * Add a new database using the KnapSack content
 * @param {*} options
 */
DBManager.prototype.loadKnapSack = async function loadKnapSack(options = {}) {
    const {
        databaseName = 'knapSack',
        forceReload = false
    } = options;
    if (this.databases[databaseName] && !forceReload) return;
    this.databases[databaseName] = await loadKnapSackPromise();
};

/**
 * Add a new database using the KnapSack content
 * @param {*} options
 */
DBManager.prototype.loadCommercials = async function loadCommercials(options = {}) {
    const {
        databaseName = 'commercials',
        forceReload = false
    } = options;
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
DBManager.prototype.loadContaminants = async function loadContaminants(options = {}) {
    const {
        databaseName = 'contaminants',
        forceReload = false,
    } = options;
    if (this.databases[databaseName] && !forceReload) return;
    this.databases[databaseName] = await loadGoogleSheetPromise();
};

/**
 * Load a google sheet containin
 * @param {*} options
 * @param {string} ['sheet'] databaseName
 */

DBManager.prototype.loadGoogleSheet = async function loadGoogleSheet(options = {}) {
    const {
        databaseName = 'sheet',
        forceReload = false,
    } = options;
    if (this.databases[databaseName] && !forceReload) return;
    this.databases[databaseName] = await loadGoogleSheetPromise();
};

DBManager.prototype.loadTest = function loadTest() {
    this.fromArray(['C1-100'], { databaseName: 'test', ionizations: '+' });
};


DBManager.prototype.fromMonoisotopicMass = function fromMonoisotopicMass(mass, options = {}) {
    const {
        databaseName = 'monoisotopic'
    } = options;
    this.databases[databaseName] = require('./fromMonoisotopicMass')(mass, options);
};

DBManager.prototype.fromArray = function fromArray(sequence, options = {}) {
    const {
        databaseName = 'generated'
    } = options;
    this.databases[databaseName] = require('./fromArray')(sequence, options);
};

DBManager.prototype.fromPeptidicSequence = function fromPeptidicSequence(sequence, options = {}) {
    const {
        databaseName = 'peptidic'
    } = options;
    this.databases[databaseName] = require('./fromPeptidicSequence')(sequence, options);
};

DBManager.prototype.listDatabases = function listDatabases() {
    return Object.keys(this.databases).sort();
};

DBManager.prototype.search = require('./search');
DBManager.prototype.searchMSEM = require('./searchMSEM');
DBManager.prototype.searchSimilarity = require('./searchSimilarity');

DBManager.Util = {
    IsotopicDistribution: require('isotopic-distribution'),
    MF: require('mf-parser').MF,
};


module.exports = DBManager;
