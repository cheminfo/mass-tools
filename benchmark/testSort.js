'use strict';

let Benchmark = require('benchmark');

let suite = new Benchmark.Suite();

const number = 1e6;
// add tests
suite
  .add('creating array of object', function () {
    let array = [];
    for (let i = 0; i < number; i++) {
      array.push({ a: Math.random(), b: Math.random() });
    }
  })
  .add('creating + sorting array of object', function () {
    let array = [];
    for (let i = 0; i < number; i++) {
      array.push({ a: Math.random(), b: Math.random() });
    }
    array.sort((a, b) => a.a - b.a);
  })
  .add('array of number', function () {
    let array = [];
    for (let i = 0; i < number; i++) {
      array.push(Math.random());
    }
  })
  .add('array of number', function () {
    let array = [];
    for (let i = 0; i < number; i++) {
      array.push(Math.random());
    }
    array.sort((a, b) => a - b);
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
