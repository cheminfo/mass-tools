'use strict';

const fetchText = require('./util/fetchText');
var Papa = require('papaparse');
var generateMFs = require('molecular-formula-generator');
var MF = require('mf-parser/src/MF');

async function getReferenceList(url, urlReferences) {
    if (urlReferences) {
        let results = await Promise.all([
            fetchText(url),
            fetchText(urlReferences)
        ]);
        return parse(results[0], results[1]);
    } else {
        let result = await fetchText(url);
        return parse(result);
    }

    function parse(tsv, tsvReferences) {
        var parsed = Papa.parse(tsv,
            {
                delimiter: '\t',
                header: true
            }
        );
        var fields = parsed.meta.fields;
        var infoFields = fields.filter(a => !['mf', 'modif', 'ESI', 'MALDI', 'positive', 'negative'].includes(a));
        var contaminants = parsed.data;


        if (tsvReferences) {
            var referencesArray = Papa.parse(tsvReferences,
                {
                    delimiter: '\t',
                    header: true
                }
            ).data;

            var references = {};
            referencesArray.forEach(
                function (ref) {
                    references[ref.label] = ref;
                }
            );
        }

        var results = [];
        for (var contaminant of contaminants) {
            if (tsvReferences) {
                // we add references
                var refs = contaminant.references.split(/[ ,]+/);
                contaminant.references = [];
                for (var ref of refs) {
                    contaminant.references.push(
                        references[ref]
                    );
                }
            }

            // we need to calculate all the possibilities
            try {
                var mfs = generateMFs([contaminant.mf, contaminant.modif]);
                for (var mf of mfs) {
                    mf.info = {};
                    for (let infoField of infoFields) {
                        mf.info[infoField] = contaminant[infoField];
                    }
                    if (!contaminant.ESI && !contaminant.MALDI && !contaminant.positive && !contaminant.negative) {
                        mf.filter = {
                            ESI: true,
                            MALDI: true,
                            positive: true,
                            negative: true
                        };
                    } else {
                        mf.filter = {
                            ESI: contaminant.ESI === 'X' ? true : false,
                            MALDI: contaminant.MALDI === 'X' ? true : false,
                            positive: contaminant.positive === 'X' ? true : false,
                            negative: contaminant.negative === 'X' ? true : false
                        };
                    }
                    mf.mf = (new MF(mf.mf)).toMF();
                    results.push(mf);
                }
            } catch (e) {
                // eslint-disable-next-line no-console
                console.warn('Non parsable molecular formula: ', contaminant.mf, contaminant.modif, e.toString());
            }
        }

        results = results.filter(function (a) {
            return a.msem !== 0;
        });

        results.sort(function (a, b) {
            return a.msem - b.msem;
        });


        var uniqueResults = [results[0]];
        for (var i = 1; i < results.length; i++) {
            if (results[i - 1].msem !== results[i].msem) {
                uniqueResults.push(results[i]);
            }
        }

        return uniqueResults;
    }
}

module.exports = getReferenceList;

