'use strict';

const EMDB = require('emdb');

let isotopicDistribution = new EMDB.Util.IsotopicDistribution('Et3N', {
  ionizations: 'H+,Na+'
});

console.log(isotopicDistribution.getParts());

console.log(isotopicDistribution.getDistribution());
