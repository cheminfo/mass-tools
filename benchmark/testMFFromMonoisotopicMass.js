'use strict';

var mfFinder = require('../packages/mf-finder/src/index');
var ccFinder = require('chemcalc').mfFromMonoisotopicMass;

let targetMass = 121;
let precision = 100000;


let resultCC = ccFinder(targetMass, {
    mfRange: 'C0-100 H0-100 N0-100',
    massRange: targetMass * precision / 1e6
});


console.log(resultCC.numberResults);

let resultMF = mfFinder(targetMass, {
    ranges: [
        { mf: 'C', min: 0, max: 100 },
        { mf: 'H', min: 0, max: 100 },
        { mf: 'N', min: 0, max: 100 },
    ],
    precision,
    allowNeutral: true
});

console.log(resultMF.info.numberResults);
