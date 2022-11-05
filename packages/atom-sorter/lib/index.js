'use strict';

function atomSorter(a, b) {
  if (a === b) return 0;
  if (a === 'C') return -1;
  if (b === 'C') return 1;
  if (a === 'H') return -1;
  if (b === 'H') return 1;
  if (a < b) return -1;
  return 1;
}

module.exports = atomSorter;
