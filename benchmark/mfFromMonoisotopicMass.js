'use strict';

var mfFinder = require('../packages/mf-finder/src/index');
var ccFinder = require('chemcalc').mfFromMonoisotopicMass;

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

let targetMass = 1200;
let precision = 1;
function chemcalc() {
    let resultCC = ccFinder(targetMass, {
        mfRange: 'C0-100 H0-100 N0-100 O0-100 S0-100 Cl0-100',
        massRange: targetMass * precision / 1e6,
        maxNumberRows: 1000000
    });
    return resultCC.results.length;
}
var nbCC = chemcalc();
function mf() {
    let resultMF = mfFinder(targetMass, {
        ranges: [
            { mf: 'C', min: 0, max: 100 },
            { mf: 'H', min: 0, max: 100 },
            { mf: 'N', min: 0, max: 100 },
            { mf: 'O', min: 0, max: 100 },
            { mf: 'S', min: 0, max: 100 },
            { mf: 'Cl', min: 0, max: 100 },
        ],
        precision,
        allowNeutral: true
    });
    return resultMF.mfs.length;
}
var nbMF = mf();
// add tests

console.log('Number found using chemcalc', nbCC);
console.log('Number found using MF', nbMF);

suite
    .add('chemcalc find mf from monoisotopic mass', chemcalc)
    .add('new chemcalc mf finder from monoisotopic mass', mf)

// add listeners
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
// run async
    .run({ async: true });

