import { furanThreeTerm } from './furanThreeTerm.js';

// https://books.google.ch/books?id=B57e37bJjqAC&pg=PA172&lpg=PA172&dq=oligonucleotide+b+fragmentation&source=bl&ots=mRr29Pexx2&sig=1NUQcWV-wuj6o9q81my86AVoRto&hl=fr&sa=X&ved=2ahUKEwjI5M3yn-7fAhUJMewKHQR6Bcs4ChDoATADegQIBhAB#v=onepage&q=oligonucleotide%20b%20fragmentation&f=false

export function addInternalTerm(mfs, internal, ter3, ter5, options = {}) {
  if (options.aw) {
    // without base loss
    mfs.push(`HO${internal}O-1H-1$w${ter3}:a${ter5}`); // A W
  }

  if (options.bw) {
    // without base loss
    mfs.push(`HO${internal}H$w${ter3}:b${ter5}`); // B W
  }

  if (options.abw) {
    // with base loss
    let fragment = furanThreeTerm(internal);
    mfs.push(`HO${fragment}$w${ter3}:a${ter5}-B`); // A minus base - W
  }

  if (options.aby) {
    // with base loss
    let fragment = furanThreeTerm(internal);
    mfs.push(`O-2P-1${fragment}$y${ter3}:a${ter5}-B`); // A minus base - Y
  }
}
