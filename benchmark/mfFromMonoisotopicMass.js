'use strict';

let Benchmark = require('benchmark');

let mfFinder = require('../packages/mf-finder/src/index');

let suite = new Benchmark.Suite();

let targetMass = 1200;
let precision = 1;

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
    limit: 10000,
    allowNeutral: true,
  });
  return resultMF.mfs.length;
}
let nbMF = mf();
// add tests

console.log('Number found using MF', nbMF);

suite
  .add('mf finder from monoisotopic mass', mf)

  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log(`Fastest is ${this.filter('fastest').map('name')}`);
  })
  // run async
  .run({ async: false });
