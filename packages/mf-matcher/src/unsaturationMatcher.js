'use strict';

/**
 * @param {object}   [entry={}}]
 * @param {object}   [options={}}]
 * @param {number}   [options.min=-Infinity] - Minimal unsaturation
 * @param {number}   [options.max=+Infinity] - Maximal unsaturation
 * @param {number}   [options.onlyIntege=false] - Integer unsaturation
 * @param {number}   [options.onlyNonInteger=false] - Non integer unsaturation
 * @return {boolean}
 */


module.exports = function unsaturationMatcher(entry, options = {}) {
    const {
        min = Number.MIN_SAFE_INTEGER,
        max = Number.MAX_SAFE_INTEGER,
        onlyInteger,
        onlyNonInteger,
    } = options;

    if (entry.unsaturation !== undefined) {
        if (entry.unsaturation < min || entry.unsaturation > max) return false;
        if (onlyInteger && !Number.isInteger(entry.unsaturation)) return false;
        if (onlyNonInteger && Number.isInteger(entry.unsaturation)) return false;
    }
    return true;
};
