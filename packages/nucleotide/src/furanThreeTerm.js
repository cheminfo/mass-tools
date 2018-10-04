'use strict';

function furanThreeTerm(nucleotide) {
  // last residue should become a furan
  let parts = nucleotide
    .replace(/ /g, '')
    .replace(/([a-zA-Z0-9\)])([A-Z])/g, '$1 $2')
    .split(/ /);
  let last = parts.pop();
  if (!last.match(/^D[atcg]mp/)) {
    throw new Error(
      'furanThreeTerm can not remove a non monophosphate nucleic acid: ' + last
    );
  }
  return parts.join('') + 'C5H5O5P';
}

module.exports = furanThreeTerm;
