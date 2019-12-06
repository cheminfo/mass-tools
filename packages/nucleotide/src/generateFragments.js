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
      wxyzBaseLoss: false,
    };
  }

  let mfs = [];
  // need to allow 0-9 to deal with neutral loss
  let mfparts = mf
    .replace(/([a-z)0-9])([A-Z][a-z](?=[a-z]))/g, '$1 $2')
    .split(/ /);

  let fiveTerm = '';
  let threeTerm = '';

  if (mfparts[0].startsWith('(')) {
    fiveTerm += mfparts[0];
    mfparts = mfparts.splice(1);
  }

  if (mfparts[mfparts.length - 1].includes('(')) {
    threeTerm += mfparts[mfparts.length - 1].replace(/^[^()]*/, '');
    mfparts[mfparts.length - 1] = mfparts[mfparts.length - 1].replace(
      /\(.*/,
      '',
    );
  }

  for (let ter5 = 1; ter5 < mfparts.length; ter5++) {
    fiveTerm += mfparts[ter5 - 1];
    threeTerm = mfparts[mfparts.length - ter5] + threeTerm;

    addFiveTerm(mfs, fiveTerm, ter5, options);
    addFiveTermBaseLoss(mfs, fiveTerm, ter5, options);
    addThreeTerm(mfs, threeTerm, ter5, options);
    addThreeTermBaseLoss(mfs, threeTerm, ter5, options);
  }

  for (let i = 1; i < mfparts.length - 1; i++) {
    let internal = '';
    for (let j = i; j < mfparts.length - 1; j++) {
      internal += mfparts[j];
      if (j > i) {
        addInternalTerm(mfs, internal, mfparts.length - i, j + 1, options);
      }
    }
  }

  return mfs;
};
