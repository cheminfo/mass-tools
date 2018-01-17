'use strict';

var mfFinder = require('../packages/mf-finder/src/index');
//var ccFinder = require('chemcalc').mfFromMonoisotopicMass;

let targetMass = 3000;
let precision = 1;


let start = Date.now();
/*
let resultCC = ccFinder(targetMass, {
    mfRange: 'C0-1000 H0-1000 N0-1000 O0-1000 S0-1000',
    massRange: targetMass * precision / 1e6
});


console.log(Date.now() - start, resultCC.numberResults, resultCC.realIteration);
*/
start = Date.now();
let resultMF = mfFinder(targetMass, {
    ranges: [
        { mf: 'C', min: 0, max: 1000 },
        { mf: 'H', min: 0, max: 1000 },
        { mf: 'N', min: 0, max: 1000 },
        { mf: 'O', min: 0, max: 1000 },
        { mf: 'S', min: 0, max: 1000 },
    ],
    precision,
    allowNeutral: true
});

console.log(Date.now() - start, resultMF.info);
