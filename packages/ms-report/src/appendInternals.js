'use strict';

function appendInternals(data) {
  // for each line (internal fragment) we calculate the vertical position
  // where it should be drawn as well and the maximal number of lines
  let maxNumberLines = 0;
  for (let result of data.results) {
    if (result.internal) {
      result.slot = assignSlot(result.from, result.to, data.residues.residues);
      if (result.slot > maxNumberLines) maxNumberLines = result.slot;
    }
  }
  for (let row of data.rows) {
    row.info.internals = maxNumberLines;
  }
}

// we need to define the height of the line.
// we need to find a height that is not yet used.
function assignSlot(from, to, residues) {
  let used = {};
  if (from > 0) from--; // we ensure that we don't put on the same line to sequences that are consecutive
  for (let i = from; i < to; i++) {
    let residue = residues[i];
    residue.paper.usedSlots.forEach((usedSlot, index) => {
      used[index] = true;
    });
  }
  let counter = 0;
  while (true) {
    if (!used[counter]) {
      break;
    }
    counter++;
  }
  for (let i = from; i < to; i++) {
    residues[i].paper.usedSlots[counter] = true;
  }
  return counter;
}

module.exports = appendInternals;
