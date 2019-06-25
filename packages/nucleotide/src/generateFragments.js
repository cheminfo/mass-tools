'use strict';

const addInternalTerm = require('./addInternalTerm');
const addFiveTerm = require('./addFiveTerm');
const addFiveTermBaseLoss = require('./addFiveTermBaseLoss');
const addThreeTerm = require('./addThreeTerm');
const addThreeTermBaseLoss = require('./addThreeTermBaseLoss');

module.exports = function generateFragments(mf, options) {
  if (options === undefined) {
    options = {
      a: false,
      ab: false,
      b: false,
      c: false,
      d: false,
      dh2o: false,
      w: false,
      x: false,
      y: false,
      z: false,
      zch2: false,
      aw: false,
      bw: false,
      abw: false,
      aby: false,
      abcdBaseLoss: false,
      wxyzBaseLoss: false
    };
  }

  var mfs = [];
  // need to allow 0-9 to deal with neutral loss
  var mfparts = mf
    .replace(/([a-z)0-9])([A-Z][a-z](?=[a-z]))/g, '$1 $2')
    .split(/ /);

  var fiveTerm = '';
  var threeTerm = '';

  for (let i = 1; i < mfparts.length; i++) {
    fiveTerm += mfparts[i - 1];
    threeTerm = mfparts[mfparts.length - i] + threeTerm;

    addFiveTerm(mfs, fiveTerm, i, options);
    addFiveTermBaseLoss(mfs, fiveTerm, i, options);
    addThreeTerm(mfs, threeTerm, i, options);
    addThreeTermBaseLoss(mfs, threeTerm, i, options);
  }

  for (let i = 1; i < mfparts.length - 1; i++) {
    let internal = '';
    for (var j = i; j < mfparts.length - 1; j++) {
      internal += mfparts[j];
      if (j > i) {
        addInternalTerm(mfs, internal, i, j, options);
      }
    }
  }

  return mfs;
};
