'use strict';

const loadKnapSackPromise = require('./loadKnapSack');
const loadGoogleSheetPromise = require('./loadGoogleSheet');
const loadCommercialsPromise = require('./loadCommercials');
const combineMFs = require('mf-generator');
const findMFs = require('mf-finder');

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

/**
 * Generates a database 'generated' from an array of molecular formula
 * @param {*} options
 * @param {string} ['generated'] databaseName
 * @param {number} [options.limit=10000000] - Maximum number of results
 * @param {boolean} [canonizeMF=true] - Canonize molecular formula
 * @param {boolean} [uniqueMFs=true] - Force canonization and make MF unique
 * @param {number} [options.filter.minMass=0] - Minimal monoisotopic mass
 * @param {number} [options.filter.maxMass=+Infinity] - Maximal monoisotopic mass
 * @param {number} [options.filter.minEM=0] - Minimal neutral monoisotopic mass
 * @param {number} [options.filter.maxEM=+Infinity] - Maximal neutral monoisotopic mass
 * @param {number} [options.filter.minMSEM=0] - Minimal observed monoisotopic mass
 * @param {number} [options.filter.maxMSEM=+Infinity] - Maximal observed monoisotopic mass
 * @param {number} [options.filter.minCharge=-Infinity] - Minimal charge
 * @param {number} [options.filter.maxCharge=+Infinity] - Maximal charge
 * @param {number} [options.filter.minUnsaturation=-Infinity] - Minimal unsaturation
 * @param {number} [options.filter.maxUnsaturation=+Infinity] - Maximal unsaturation
 * @param {number} [options.filter.onlyIntegerUnsaturation=false] - Integer unsaturation
 * @param {number} [options.filter.onlyNonIntegerUnsaturation=false] - Non integer unsaturation
 * @param {object} [options.filter.atoms] - object of atom:{min, max}
 */

DBManager.prototype.fromArray = function fromArray(mfsArray, options = {}) {
    const {
        databaseName = 'generated'
    } = options;
    this.databases[databaseName] = combineMFs(mfsArray, options);

};

DBManager.prototype.loadTest = function loadTest() {
    this.fromArray(['C1-100'], { databaseName: 'test', ionizations: '+' });
};


/**
 * Generates a database 'monoisotopic' from an array of molecular formula
 * @param {*} options
 * @param {number} [mass=0] - Target mass
 * @param {string} [options.databaseName='monoisotopic']
 * @param {number} [options.precision=1000] - Minimal charge
 * @param {number} [options.minCharge=-Infinity] - Minimal charge
 * @param {number} [options.maxCharge=+Infinity] - Maximal charge
 * @param {number} [options.minUnsaturation=-Infinity] - Minimal unsaturation
 * @param {number} [options.maxUnsaturation=+Infinity] - Maximal unsaturation
 * @param {number} [options.onlyIntegerUnsaturation=false] - Integer unsaturation
 * @param {number} [options.onlyNonIntegerUnsaturation=false] - Non integer unsaturation
 * @param {number} [options.maxIterations=1e8] - Max number of iterations
 * @param {boolean} [options.allowNeutral=false] - Allow neutral molecules
 * @param {string} [options.ionizations=''] - Comma separated list of ionizations
 * @param {string} [options.ranges=''] - Range to search the molecular formula like 'C0-10 H0-10'
 */

DBManager.prototype.fromMonoisotopicMass = function fromMonoisotopicMass(mass, options = {}) {
    const {
        databaseName = 'monoisotopic'
    } = options;
    this.databases[databaseName] = findMFs(mass, options).mfs;
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


module.exports = DBManager;
