import { furanThreeTerm } from '.';

export function addFiveTerm(mfs, fiveTerm, i, options) {
  if (options.a) mfs.push(`${fiveTerm}O-1H-1$a${i}`); // neutral ok
  if (options.ab && i > 1) mfs.push(`${furanThreeTerm(fiveTerm)}$a${i}-B`); // A minus base
  if (options.b) mfs.push(`${fiveTerm}H$b${i}`); // need to add an hydrogen, see: https://books.google.ch/books?id=B57e37bJjqAC&pg=PA172&lpg=PA172&dq=oligonucleotide+b+fragmentation&source=bl&ots=mRr29Pexx2&sig=1NUQcWV-wuj6o9q81my86AVoRto&hl=fr&sa=X&ved=2ahUKEwjI5M3yn-7fAhUJMewKHQR6Bcs4ChDoATADegQIBhAB#v=onepage&q&f=true
  if (options.c) mfs.push(`${fiveTerm}PO2$c${i}`); // neutral ok
  if (options.d) mfs.push(`${fiveTerm}PO3H2$d${i}`);
  if (options.dh2o) mfs.push(`${fiveTerm}PO2$d${i}-H2O`);
}
