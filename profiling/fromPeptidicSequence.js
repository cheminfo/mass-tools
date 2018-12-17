'use strict';

var fromPeptidicSequence = require('../packages/emdb/src/fromPeptidicSequence');

console.time('start');
let results = fromPeptidicSequence(
  'MQIFVKTLTSDTIENVKAKIQDKEGIPPDQQMQIFVKTLTSDTIENVKAKIQDKEGIPPDQQMQIFVKTLTSDTIENVKAKIQDKEGIPPDQQ',
  {
    mfsArray: [],
    digestion: {},
    filter: {},
    nucleic: {},
    ionizations: 'H1(1+).H2(2+).H3(3+)',
    protonation: false,
    fragmentation: {
      c: true,
      z: true,
      ya: true,
      yb: true
    }
  }
);

console.log('Number results:', results.length);
console.timeEnd('start');
