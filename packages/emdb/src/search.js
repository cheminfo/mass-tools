'use strict';

const matcher = require('mf-matcher').general;

/*
    Searching by various criteria. This mass will not take into account the mass
    of the mass of the electron

    {object}    [options={}]
    {array}     [options.databases] - an array containing the name of the databases so search, by default all
    {boolean}   [options.flatten] - should we return the array as a flat result
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

