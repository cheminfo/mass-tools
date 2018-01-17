'use strict';

var mfFinder = require('../packages/mf-finder/src/index');
var ccFinder = require('chemcalc').mfFromMonoisotopicMass;

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

let targetMass = 121;
let precision = 100000;

// add tests
suite
    .add('new', function () {
        let resultMF = mfFinder(targetMass, {
            ranges: [
                { mf: 'C', min: 0, max: 100 },
                { mf: 'H', min: 0, max: 100 },
                { mf: 'N', min: 0, max: 100 },
            ],
            precision,
            allowNeutral: true
        });
    })
    .add('chemcalc', function () {
        let resultCC = ccFinder(targetMass, {
            mfRange: 'C0-100 H0-100 N0-100',
            massRange: targetMass * precision / 1e6
        });
    })
// add listeners
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
// run async
    .run({ async: true });

