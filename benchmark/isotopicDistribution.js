'use strict';

let IsotopicDistribution = require('../packages/isotopic-distribution/src/index');

let analyseMF = require('chemcalc').analyseMF;
let Benchmark = require('benchmark');

let suite = new Benchmark.Suite();

let mf = 'Ala1000';
let fwhm = 0.001;

function chemcalc() {
  let resultCC = analyseMF(mf, {
    fwhm,
    joiningAlgorithm: 'center',
    threshold: 1e-5,
    isotopomers: 'arrayXXYY',
  });
  return resultCC.arrayXXYY[0].length;
}
let resultCC = chemcalc();
console.log(resultCC);

function newCC() {
  let isotopicDistribution = new IsotopicDistribution(mf, { fwhm });
  let array = isotopicDistribution.getDistribution().array;
  return array.reduce((sum, value) => sum + value.y, 0);
}
let resultMF = newCC();
// add tests

// console.log('Number found using chemcalc', nbCC);
console.log('Number found using MF', resultMF);

suite
  .add('chemcalc isotopic distribution', chemcalc)
  .add('new chemcalc isotopic distribution', newCC)

  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log(`Fastest is ${this.filter('fastest').map('name')}`);
  })
  // run async
  .run({ async: true });
