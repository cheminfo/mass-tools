'use strict';

const fetchText = require('./util/fetchText');
var Papa = require('papaparse');
var generateMFs = require('molecular-formula-generator');

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
        var contaminants = Papa.parse(tsv,
            {
                delimiter: '\t',
                header: true
            }
        ).data;

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
            var mfs = generateMFs([contaminant.mf, contaminant.modif]);
            for (var mf of mfs) {
                mf.info = contaminant;
                if (!contaminant.ESI && !contaminant.MALDI && !contaminant.positive && !contaminant.negative) {
                    mf.ESI = true;
                    mf.MALDI = true;
                    mf.positive = true;
                    mf.negative = true;
                } else {
                    mf.ESI = contaminant.ESI === 'X' ? true : false;
                    mf.MALDI = contaminant.MALDI === 'X' ? true : false;
                    mf.positive = contaminant.positive === 'X' ? true : false;
                    mf.negative = contaminant.negative === 'X' ? true : false;
                }
                mf.similarity = '';
                mf.mf = CC.analyseMF(mf.mf).mf;
                results.push(mf);
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

