'use strict';

const { xySortX, xyJoinX } = require('ml-spectra-processing');

/**
 * Remove an integer number of time the specifiedd monoisotopic mass
 * Mass remainder analysis (MARA): https://doi.org/10.1021/acs.analchem.7b04730
 * @param {object} spectrum
 * @param {number} mass
 * @param {object} [options={}
 * @param {number} [options.delta=0.001]
 */
function getMassRemainder(spectrum, mass, options = {}) {
  const { delta = 0.001 } = options;
  const x = spectrum.x.slice();
  const y = spectrum.y;
  for (let i = 0; i < x.length; i++) {
    const factor = Math.floor(x[i] / mass);
    x[i] = x[i] - factor * mass;
  }
  // we sort and join
  return xyJoinX(xySortX({ x, y }), { delta });
}

module.exports = getMassRemainder;
