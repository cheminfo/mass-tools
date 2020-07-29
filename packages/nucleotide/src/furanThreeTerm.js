'use strict';

function furanThreeTerm(nucleotide) {
  // last residue should become a furan
  let parts = nucleotide
    .replace(/ /g, '')
    .replace(/([a-z)0-9])([A-Z][a-z](?=[a-z]))/g, '$1 $2')
    .split(/ /);
  let last = parts.pop();
  if (!last.match(/D[atcg]mp(.*)$/)) {
    // eslint-disable-next-line no-console
    console.warn(
      `furanThreeTerm can not remove a non monophosphate nucleic acid: ${last}`,
    );
    return parts.join('') + last;
  }
  return parts.join('') + last.replace(/D[atcg]mp(.*)$/, 'Furp');
}

module.exports = furanThreeTerm;
