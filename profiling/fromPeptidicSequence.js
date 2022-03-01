'use strict';

const fromPeptidicSequence = require('../packages/emdb/src/fromPeptidicSequence');
const IsotopicDistribution = require('../packages/isotopic-distribution/src/IsotopicDistribution');

console.time('parsing');
let results = fromPeptidicSequence(
  'MQIFVKTLTSDTIENVKAKIQDKEGIPPDQQMQIFVKTLTSDTIENVKAKIQDKEGIPPDQQMQIFVKTLTSDTIENVKAKIQDKEIQDKEGIPPDQQ',
  {
    mfsArray: ['Ru,'],
    digestion: {},
    filter: {},
    nucleic: {},
    ionizations: 'H1(1+).H2(2+).H3(3+)',
    protonation: false,
    fragmentation: {
      c: true,
      z: true,
      ya: true,
      yb: true,
    },
  },
);
console.timeEnd('parsing');
console.time('distribution');
let counter = 0;

for (let i = 0; i < results.length; i++) {
  let result = results[i];
  if (i % 1000 === 0) {
    console.log(`Isotopic distribution: ${i}/${results.length}`);
  }
  let isotopicDistribution = new IsotopicDistribution(result.mf);
  let xy = isotopicDistribution.getXY();
}

console.log('Number results:', results.length);
console.timeEnd('distribution');
