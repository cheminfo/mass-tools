'use strict';

function baseLossExhaustive(nucleotide) {
  // any residue can loose a base
  let results = [];
  let parts = nucleotide
    .replace(/ /g, '')
    .replace(/([a-zA-Z0-9)])(?=[A-Z])/g, '$1 ')
    .split(/ /);
  let counter = 0;
  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
    let middle = '';
    if (part.match(/^D[atcgu]mp$/)) {
      middle = 'Drmp';
      counter++;
    } else if (part.match(/^[ATCGU]mp$/)) {
      middle = 'Rmp';
      counter++;
    } else {
      continue;
    }
    let begin = parts.slice(0, i);
    let end = parts.slice(i + 1);

    results.push(`${begin.join('') + middle + end.join('')}$-B${counter}`);
  }

  return results;
}

module.exports = baseLossExhaustive;
