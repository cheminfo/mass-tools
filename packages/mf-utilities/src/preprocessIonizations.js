'use strict';

const MF = require('mf-parser/src/MF');

const processRange = require('./processRange');

module.exports = function preprocessIonizations(ionizationsString = '') {
  if (Array.isArray(ionizationsString)) return ionizationsString;
  let ionizations = ionizationsString.split(/ *[.,;\t\r\n]+ */);

  // it is allowed to have ranges in Ionizations. We need to explode them.

  let results = [];

  for (let ionization of ionizations) {
    let parts = processRange(ionization);
    for (let part of parts) {
      let info = new MF(part).getInfo();
      results.push({
        mf: part,
        em: info.monoisotopicMass,
        charge: info.charge,
        atoms: info.atoms,
      });
    }
  }

  return results;
};
