'use strict';

const matcher = require('mf-matcher');

/*
    Searching by various criteria. This mass will not take into account the mass
    of the mass of the electron
*/

module.exports = function search(filter = {}, options = {}) {
    let {
        databases = Object.keys(this.databases),
        flatten = false
    } = options;

    let results = {};
    for (let database of databases) {
        results[database] = this.databases[database].filter((entry) => matcher(entry, filter));
    }

    if (flatten) {
        let flattenResults = [];
        for (let database of databases) {
            for (let entry of results[database]) {
                entry.database = database;
                flattenResults.push(entry);
            }
        }
        return flattenResults;
    } else {
        return results;
    }
};

