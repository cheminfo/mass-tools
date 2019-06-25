'use strict';

const furanThreeTerm = require('./furanThreeTerm');

// https://books.google.ch/books?id=B57e37bJjqAC&pg=PA172&lpg=PA172&dq=oligonucleotide+b+fragmentation&source=bl&ots=mRr29Pexx2&sig=1NUQcWV-wuj6o9q81my86AVoRto&hl=fr&sa=X&ved=2ahUKEwjI5M3yn-7fAhUJMewKHQR6Bcs4ChDoATADegQIBhAB#v=onepage&q=oligonucleotide%20b%20fragmentation&f=false

function addInternalTerm(mfs, internal, i, j, options = {}) {
  if (options.aw) {
    // without base loss
    mfs.push(`HO${internal}O-1H-1$w${i + 1}:a${j + 1}`); // A W
  }

  if (options.bw) {
    // without base loss
    mfs.push(`HO${internal}H$w${i + 1}:a${j + 1}`); // B W
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

module.exports = addInternalTerm;
