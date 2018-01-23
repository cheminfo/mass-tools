'use strict';

const loadKnapSackPromise = require('./loadKnapSack');
const loadGoogleSheetPromise = require('./loadGoogleSheet');
const combineMFs = require('mf-generator');
const findMFs = require('mf-finder');

function DBManager() {
    this.databases = {};
}

DBManager.prototype.loadKnapSack = async function loadKnapSack(options = {}) {
    const {
        databaseName = 'knapSack'
    } = options;
    this.databases[databaseName] = await loadKnapSackPromise();
};

DBManager.prototype.loadContaminants = async function loadContaminants(options = {}) {
    const {
        databaseName = 'contaminants'
    } = options;
    this.databases[databaseName] = await loadGoogleSheetPromise();

    //   console.log(this.databases[databaseName]);

};

DBManager.prototype.loadGoogleSheet = async function loadContaminants(options = {}) {
    const {
        databaseName = 'contaminants'
    } = options;
    this.databases[databaseName] = await loadGoogleSheetPromise();
};

DBManager.prototype.fromArray = function fromArray(mfsArray, options = {}) {
    const {
        databaseName = 'created'
    } = options;
    this.databases[databaseName] = combineMFs(mfsArray, options);
};

DBManager.prototype.fromMonoisotopicMass = function fromMonoisotopicMass(mass, options = {}) {
    const {
        databaseName = 'monoisotopic'
    } = options;
    this.databases[databaseName] = findMFs(mass, options).mfs;
};

DBManager.prototype.listDatabases = function listDatabases() {
    return Object.keys(this.databases).sort();
};

DBManager.prototype.search = require('./search');

module.exports = DBManager;
