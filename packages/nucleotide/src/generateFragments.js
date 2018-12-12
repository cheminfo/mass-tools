'use strict';

const furanThreeTerm = require('./furanThreeTerm');

module.exports = function (mf, options) {
  if (options === undefined) {
    options = {
      a: false,
      ab: false,
      b: false,
      c: false,
      d: false,
      w: false,
      x: false,
      y: false,
      z: false
    };
  }

  var mfs = [];
  // need to allow 0-9 to deal with neutral loss
  var mfparts = mf
    .replace(/([a-z)0-9])([A-Z][a-z](?=[a-z]))/g, '$1 $2')
    .split(/ /);

  var fiveTerm = '';
  var threeTerm = '';

  for (var i = 1; i < mfparts.length; i++) {
    fiveTerm += mfparts[i - 1];
    threeTerm = mfparts[mfparts.length - i] + threeTerm;
    addFiveTerm(mfs, fiveTerm, i, options);
    addThreeTerm(mfs, threeTerm, i, options);
  }

  if (mfs.length === 0) {
    mfs = mfs.concat([mf]);
  }

  return mfs;
};

function addFiveTerm(mfs, fiveTerm, i, options) {
  if (options.a) mfs.push(`${fiveTerm}O-1$a${i}`);
  if (options.ab) mfs.push(`${furanThreeTerm(fiveTerm)}$a${i} - B`);
  if (options.b) mfs.push(`${fiveTerm}$b${i}`);
  if (options.c) mfs.push(`${fiveTerm}PO2H$c${i}`);
  if (options.d) mfs.push(`${fiveTerm}PO3H$d${i}`);
}

function addThreeTerm(mfs, threeTerm, i, options) {
  if (options.w) mfs.push(`O${threeTerm}$w${i}`);
  if (options.x) mfs.push(`${threeTerm}$x${i}`);
  if (options.y) mfs.push(`O-2H-1P-1${threeTerm}$y${i}`);
  if (options.z) mfs.push(`O-3H-2P-1${threeTerm}$z${i}`);
}
