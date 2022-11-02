'use strict';

let generateMFs = require('mf-generator');
let MF = require('mf-parser/src/MF');
let Papa = require('papaparse');

const fetchText = require('./util/fetchText.js');

async function mfFromGoogleSheet(url, options = {}) {
  let { urlReferences } = options;

  if (urlReferences) {
    let results = await Promise.all([fetchText(url), fetchText(urlReferences)]);
    return parse(results[0], results[1]);
  } else {
    let result = await fetchText(url);
    return parse(result);
  }

  async function parse(tsv, tsvReferences) {
    let parsed = Papa.parse(tsv, {
      delimiter: '\t',
      header: true,
    });
    let fields = parsed.meta.fields;
    let infoFields = fields.filter(
      (a) =>
        !['mf', 'modif', 'ESI', 'MALDI', 'positive', 'negative'].includes(a),
    );
    let formulas = parsed.data;

    let references = {};
    if (tsvReferences) {
      let referencesArray = Papa.parse(tsvReferences, {
        delimiter: '\t',
        header: true,
      }).data;

      referencesArray.forEach((r) => {
        references[r.label] = r;
      });
    }

    let results = [];
    for (let formula of formulas) {
      if (tsvReferences) {
        // we add references
        let refs = formula.references.split(/[ ,]+/);
        formula.references = [];
        for (let ref of refs) {
          formula.references.push(references[ref]);
        }
      }
      // we need to calculate all the possibilities
      try {
        let mfs = await generateMFs([formula.mf], {
          ionizations: formula.modif,
        });
        for (let mf of mfs) {
          mf.info = {};
          for (let infoField of infoFields) {
            mf.info[infoField] = formula[infoField];
          }
          if (
            !formula.ESI &&
            !formula.MALDI &&
            !formula.positive &&
            !formula.negative
          ) {
            mf.filter = {
              ESI: true,
              MALDI: true,
              positive: true,
              negative: true,
            };
          } else {
            mf.filter = {
              ESI: formula.ESI === 'X' ? true : false,
              MALDI: formula.MALDI === 'X' ? true : false,
              positive: formula.positive === 'X' ? true : false,
              negative: formula.negative === 'X' ? true : false,
            };
          }
          mf.mf = new MF(mf.mf).toMF();
          results.push(mf);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(
          'Non parsable molecular formula: ',
          formula.mf,
          formula.modif,
          e.toString(),
        );
      }
    }

    results = results.filter((a) => {
      return a.ms.em !== 0;
    });

    results.sort((a, b) => {
      return a.ms.em - b.ms.em;
    });

    let uniqueResults = [results[0]];
    for (let i = 1; i < results.length; i++) {
      if (results[i - 1].ms.em !== results[i].ms.em) {
        uniqueResults.push(results[i]);
      }
    }

    return uniqueResults;
  }
}

module.exports = mfFromGoogleSheet;
