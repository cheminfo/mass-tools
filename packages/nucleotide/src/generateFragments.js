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
      dh2o: false,
      w: false,
      x: false,
      y: false,
      z: false,
      zch2: false,
      abw: false
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
    addThreeTerm(mfs, threeTerm, i, options);
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

  if (mfs.length === 0) {
    mfs = mfs.concat([mf]);
  }

  return mfs;
};

function addFiveTerm(mfs, fiveTerm, i, options) {
  if (options.a) mfs.push(`${fiveTerm}O-1H-1$a${i}`); // neutral ok
  if (options.ab) mfs.push(`${furanThreeTerm(fiveTerm)}$a${i} - B`); // A minus base
  if (options.b) mfs.push(`${fiveTerm}H-1$b${i}`);
  if (options.c) mfs.push(`${fiveTerm}PO2$c${i}`); // neutral ok
  if (options.d) mfs.push(`${fiveTerm}PO3H2$d${i}`);
  if (options.dh2o) mfs.push(`${fiveTerm}PO2$d-H2O${i}`);
}

function addThreeTerm(mfs, threeTerm, i, options) {
  if (options.w) mfs.push(`HO${threeTerm}$w${i}`); // neutral ok
  if (options.x) mfs.push(`H-1${threeTerm}$x${i}`); // neutral ok
  if (options.y) mfs.push(`O-2P-1${threeTerm}$y${i}`); // neutral ok
  if (options.z) mfs.push(`O-3H-1P-1(+)${threeTerm}$z${i}`);
  if (options.zch2) mfs.push(`O-3H-3C-1P-1(+)${threeTerm}$z-CH2${i}`);
}

// https://books.google.ch/books?id=B57e37bJjqAC&pg=PA172&lpg=PA172&dq=oligonucleotide+b+fragmentation&source=bl&ots=mRr29Pexx2&sig=1NUQcWV-wuj6o9q81my86AVoRto&hl=fr&sa=X&ved=2ahUKEwjI5M3yn-7fAhUJMewKHQR6Bcs4ChDoATADegQIBhAB#v=onepage&q=oligonucleotide%20b%20fragmentation&f=false

function addInternalTerm(mfs, internal, i, j, options = {}) {
  if (options.abw) {
    let fragment = furanThreeTerm(internal);
    mfs.push(`HO${fragment}$B${i + 1}:B${j}`); // A minus base - W
  }
}
