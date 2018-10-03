'use strict';

function furanThreeTerm(nucleotide) {
  // last residue should become a furan
  let parts = nucleotide
    .replace(/ /g, '')
    .replace(/([A-Z])([a-z])/g, '$1 $2')
    .split(/ /);
  parts.length--;
  return parts.join('') + 'C5H5O5P';
}
