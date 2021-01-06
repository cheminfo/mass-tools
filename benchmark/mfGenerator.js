'use strict';

let Benchmark = require('benchmark');

let generateMFs = require('../packages/mf-generator/src/index');

let suite = new Benchmark.Suite();

// add tests
suite
  .add('complex calculation', function () {
    let mfsArray = ['C0-100', 'O0-100', 'O0-100'];
    let result = generateMFs(mfsArray, {
      filter: {
        minEM: 100,
        maxEM: 1000,
      },
    });
    console.log(result.length);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log(`Fastest is ${this.filter('fastest').map('name')}`);
  })
  .run({ async: true });
