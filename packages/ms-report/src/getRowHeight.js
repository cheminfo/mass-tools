'use strict';

function getRowHeight(results, residues, options = {}) {
  const {
    verticalShiftForTerminalAnnotations,
    spaceBetweenInternalLines
  } = options;
  // for each line (internal fragment) we calculate the vertical position
  // where it should be drawn as well and the maximal number of lines
  let maxNumberLines = 0;
  for (let result of results) {
    if (result.internal) {
      result.slot = assignSlot(result.from, result.to, residues);
      if (result.slot > maxNumberLines) maxNumberLines = result.slot;
    }
  }

  return (
    verticalShiftForTerminalAnnotations +
    spaceBetweenInternalLines * (maxNumberLines + 6)
  );
}

// we need to define the height of the line.
// we need to find a height that is not yet used.
function assignSlot(from, to, residues) {
  let used = {};
  for (let i = from; i < to; i++) {
    let residue = residues[i];
    residue.usedSlots.forEach(function (usedSlot, index) {
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
    residues[i].usedSlots[counter] = true;
  }
  return counter;
}

module.exports = getRowHeight;
