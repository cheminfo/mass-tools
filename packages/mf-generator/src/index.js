'use strict';

const {ELECTRON_MASS} = require('chemical-elements/src/constants');

const MF = require('mf-parser').MF;

/**
 * Generate all the possible combinations of molecular formula and calculate
 * for each of them the monoisotopic mass and observed moniisotopic mass (m/z)
 *
 * @param keys
 * @param options
 * @param {number} [options.limit=1000000] - Maximum number of results
 * @param {number} [options.minMass=0] - Minimal monoisotopic mass
 * @param {number} [options.maxMass=+Infinity] - Maximal monoisotopic mass
 * @param {number} [options.minMSMass=0] - Minimal observed monoisotopic mass
 * @param {number} [options.maxMSMass=+Infinity] - Maximal observed monoisotopic mass
 * @param {number} [options.minCharge=-Infinity] - Minimal charge
 * @param {number} [options.maxCharge=+Infinity] - Maximal charge
 * @param {boolean} [canonizeMF=true] - Canonize molecular formula
 * @returns {Array}
 */


module.exports = function combineMFs(keys, options = {}) {
    let {
        limit = 1000000,
    } = options;

    if (!Array.isArray(keys)) throw new Error('You need to specify an array of strings or arrays');

    // we allow String delimited by ". , or ;" instead of an array
    for (let i = 0; i < keys.length; i++) {
        if (!Array.isArray(keys[i])) {
            keys[i] = keys[i].split(/[.,;]/).filter((a) => a);
        }
    }

    // we allow ranges in a string ...
    // problem with ranges is that we need to now to what the range applies
    for (let i = 0; i < keys.length; i++) {
        let parts = keys[i];
        let newParts = [];
        for (let j = 0; j < parts.length; j++) {
            let part = parts[j];
            let comment = part.replace(/^([^$]*\$|.*)/, '');
            part = part.replace(/\$.*/, '');
            if (~part.indexOf('-')) { // there are ranges ... we are in trouble !
                newParts = newParts.concat(processRange(part, comment));
            } else {
                newParts.push(parts[j]); // the part with the comments !
            }
        }
        keys[i] = newParts;
    }

    let results = [];
    let sizes = [];
    let currents = [];
    for (let i = 0; i < keys.length; i++) {
        sizes.push(keys[i].length - 1);
        currents.push(0);
    }
    let position = 0;
    let evolution = 0;

    while (position < currents.length) {
        if (currents[position] < sizes[position]) {
            evolution++;
            appendResult(results, currents, keys, options);
            currents[position]++;
            for (let i = 0; i < position; i++) {
                currents[i] = 0;
            }
            position = 0;
        } else {
            position++;
        }
        if (evolution > limit) {
            throw new Error('You have reached the limit of ' + options.limit + '. You could still change this value using the limit option but it is likely to crash.');
        }
    }
    appendResult(results, currents, keys, options);
    return results;
};


var ems = {};

// internal method to for cache
function getMonoisotopicMass(mfString) {
    if (!ems[mfString]) {
        // we need to calculate based on the mf but not very often ...
        var mf = new MF(mfString);
        var info = mf.getInfo();
        ems[mfString] = {
            em: info.monoisotopicMass,
            charge: info.charge,
            mw: info.mass
        };
    }
    return ems[mfString];
}

function getEMFromParts(parts, currents) {
    var charge = 0;
    var em = 0;
    var mw = 0;

    for (var i = 0; i < parts.length; i++) {
        var part = parts[i][currents[i]];
        if (part) {
            var info = getMonoisotopicMass(part);
            charge += info.charge;
            em += info.em;
            mw += info.mw;
        }
    }
    var msem = em;
    if (charge > 0) {
        msem = msem / charge - ELECTRON_MASS;
    } else if (charge < 0) {
        msem = msem / (charge * -1) + ELECTRON_MASS;
    } else {
        msem = 0;
    }
    return {
        charge,
        em,
        msem,
        mw
    };
}

function appendResult(results, currents, keys, options = {}) {
    const {
        minMass = 0,
        maxMass = +Infinity,
        minMSMass = 0,
        maxMSMass = +Infinity,
        minCharge = -Infinity,
        maxCharge = +Infinity,
        canonizeMF
    } = options;

    // this script is designed to combine molecular formula
    // that may contain comments after a "$" sign
    // therefore we should put all the comments at the ned

    var info = getEMFromParts(keys, currents);

    var em = info.em;
    var mw = info.mw;
    var msem = info.msem;
    var charge = info.charge;


    if ((mw < minMass) || (mw > maxMass)) return;
    if ((msem < minMSMass) || (msem > maxMSMass)) return;
    if ((charge < minCharge) || (charge > maxCharge)) return;

    var result = {
        mf: '',
        em,
        mw,
        msem,
        charge,
        parts: []
    };
    var comments = [];
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i][currents[i]];
        if (key) {
            result.parts[i] = key;
            if (key.indexOf('$') > -1) {
                comments.push(key.replace(/^[^$]*\$/, ''));
                key = key.replace(/\$.*/, '');
            }
            result.mf += key;
        }
    }

    if (canonizeMF) {
        result.mf = (new MF(result.mf)).toMF();
    }

    if (comments.length > 0) result.mf += '$' + comments.join(' ');
    results.push(result);
}

function processRange(string, comment) {
    var results = [];
    var parts = string.split(/([0-9]+-[0-9]+)/).filter(v => v); // remove empty parts
    let position = -1;
    var mfs = [];
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        if (!~part.search(/[0-9]-[0-9]/)) {
            position++;
            mfs[position] = {
                mf: part,
                min: 1,
                max: 1
            };
        } else {
            mfs[position].min = part.replace(/^(-?[0-9]*)-(-?[0-9]*)/, '$1') >> 0;
            mfs[position].max = part.replace(/^(-?[0-9]*)-(-?[0-9]*)/, '$2') >> 0;
        }
    }

    let currents = new Array(mfs.length);
    for (let i = 0; i < currents.length; i++) {
        currents[i] = mfs[i].min;
    }
    position = 0;
    while (position < currents.length) {
        if (currents[position] < mfs[position].max) {
            results.push(getMF(mfs, currents, comment));
            currents[position]++;
            for (let i = 0; i < position; i++) {
                currents[i] = mfs[i].min;
            }
            position = 0;
        } else {
            position++;
        }
    }
    results.push(getMF(mfs, currents, comment));
    return results;
}

function getMF(mfs, currents, comment) {
    var mf = '';
    for (var i = 0; i < mfs.length; i++) {
        if (currents[i] === 0) {
            // TODO we need to remove from currents[i] till we reach another part of the MF
            mf += removeMFLastPart(mfs[i].mf);
        } else {
            mf += mfs[i].mf;
            if (currents[i] !== 1) {
                mf += currents[i];
            }
        }
    }
    if (comment) mf += '$' + comment;
    return mf;
}

/*
 Allows to remove the last part of a MF. Useful when you have something with '0' times.
 C10H -> C10
 C10((Me)N) -> C10
 C10Ala -> C10
 C10Ala((Me)N) -> C10Ala
 */
function removeMFLastPart(mf) {
    var parenthesis = 0;
    var start = true;
    for (var i = mf.length - 1; i >= 0; i--) {
        var ascii = mf.charCodeAt(i);

        if (ascii > 96 && ascii < 123) { // lowercase
            if (!start && !parenthesis) {
                return mf.substr(0, i + 1);
            }
        } else if (ascii > 64 && ascii < 91) { // uppercase
            if (!start && !parenthesis) {
                return mf.substr(0, i + 1);
            }
            start = false;
        } else if (ascii === 40) { // (
            parenthesis--;
            if (!parenthesis) return mf.substr(0, i);
        } else if (ascii === 41) { // )
            parenthesis++;
        } else {
            start = false;
            if (!parenthesis) return mf.substr(0, i + 1);
        }
    }
    return '';
}
