'use strict';

const preprocessIonizations = require('mf-utilities/src/preprocessIonizations');
const mfParser = require('mf-parser');
const getMsInfo = require('mf-utilities/src/getMsInfo');

const fetch = require('./util/fetchJSON');

/**
 * Generates a database 'pubchem' based on all molecular formula available
 * in the database and a monoisotopic mass.
 * @param {number} mass - Observed monoisotopic mass
 * @param {object} [options={}]
 * @param {string} [options.databaseName='pubchem']
 * @param {string} [options.ionizations=''] - string containing a comma separated list of modifications
 * @param {number} [options.precision=1000] - Precision of the monoisotopic mass in ppm
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {number} [options.minPubchemEntries=5] - Minimal number of molecules having a specific MF
 * @param {number} [options.allowNeutralMolecules=false] - Should we display uncharged molecules (non observable by mass)
 * @param {number} [options.url='https://pubchem.cheminfo.org/mfs/em'] - URL of the webservice
 */

module.exports = async function searchPubchem(mass, options = {}) {
  const {
    url = 'https://pubchem.cheminfo.org/mfs/em',
    precision = 1000,
    limit = 1000,
    minPubchemEntries = 5,
    allowNeutralMolecules = false
  } = options;

  let promises = [];
  let ionizations = preprocessIonizations(options.ionizations);
  for (let ionization of ionizations) {
    let realMass = mass * ionization.charge - ionization.em;
    promises.push(
      fetch(
        `${url}?em=${realMass}&precision=${precision}&limit=${limit}&minPubchemEntries=${minPubchemEntries}`
      )
    );
  }

  let results = await Promise.all(promises);

  let mfs = [];
  for (let i = 0; i < results.length; i++) {
    for (let mf of results[i].result) {
      try {
        let mfInfo = new mfParser.MF(mf.mf).getInfo();
        mfInfo.ionization = ionizations[i];
        mfInfo.em = mfInfo.monoisotopicMass;
        mfInfo.ms = getMsInfo(mfInfo, {
          targetMass: mass,
          allowNeutralMolecules
        }).ms;
        mfInfo.info = { nbPubchemEntries: mf.total };
        mfs.push(mfInfo);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`${e}`);
      }
    }
  }
  // because we can combine many ionizations we should resort the data
  mfs.sort((a, b) => a.ms.ppm - b.ms.ppm);
  return mfs;
};
