'use strict';

function baseLoss(nucleotide) {
  // any residue can loose a base
  let results = [];
  let parts = nucleotide
    .replace(/ /g, '')
    .replace(/([a-zA-Z0-9)])([A-Z])/g, '$1 $2')
    .split(/ /);
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].length !== 4) continue;
    let begin = parts.slice(0, i);
    let middle = 'XXX';
    let end = parts.slice(i + 1);

    results.push(begin.join('') + middle + end.join(''));
  }

  return results;
}

module.exports = baseLoss;
