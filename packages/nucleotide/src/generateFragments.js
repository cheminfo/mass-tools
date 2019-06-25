'use strict';

const furanThreeTerm = require('./furanThreeTerm');
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

  for (let i = 1; i < mfparts.length; i++) {
    let internal = '';
    for (var j = i; j < mfparts.length; j++) {
      internal += mfparts[j];
      if (j > i) {
        addInternalTerm(mfs, internal, i, j, options);
      }
    }
  }

  return mfs;
};

// https://books.google.ch/books?id=B57e37bJjqAC&pg=PA172&lpg=PA172&dq=oligonucleotide+b+fragmentation&source=bl&ots=mRr29Pexx2&sig=1NUQcWV-wuj6o9q81my86AVoRto&hl=fr&sa=X&ved=2ahUKEwjI5M3yn-7fAhUJMewKHQR6Bcs4ChDoATADegQIBhAB#v=onepage&q=oligonucleotide%20b%20fragmentation&f=false

function addInternalTerm(mfs, internal, i, j, options = {}) {
  if (options.aw) {
    // without base loss
    mfs.push(`HO${internal}O-1H-1$w${i + 1}:a${j + 1}`); // A W
  }

  if (options.bw) {
    // without base loss
    mfs.push(`HO${internal}H-1$w${i + 1}:a${j + 1}`); // B W
  }

  if (options.abw) {
    // with base loss
    let fragment = furanThreeTerm(internal);
    mfs.push(`HO${fragment}$w${i + 1}:aB${j + 1}`); // A minus base - W
  }

  if (options.aby) {
    // with base loss
    let fragment = furanThreeTerm(internal);
    mfs.push(`O-2P-1${fragment}$y${i + 1}:aB${j + 1}`); // A minus base - Y
  }
}
