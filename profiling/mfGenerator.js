'use strict';

// node --inspect --inspect-brk profiling/mfGenerator.js
// and go in chrome://inspect

let generateMFs = require('../packages/mf-generator/src/index');

console.time('start');
let mfsArray = ['C0-100', 'H0-100', 'O0-5', 'Ru0-100'];

let results = generateMFs(mfsArray, {
  filter: {
    minEM: 100,
    maxEM: 1000,
  },
});
console.log('Number results:', results.length);
console.timeEnd('start');
