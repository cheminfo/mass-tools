'use strict';

/**
 * For each row we calculate internals, label over and label under
 * @param {*} data
 */
function appendRowsInformation(data) {
  for (let result of data.results) {
    if (
      !result.internal &&
      result.position !== undefined &&
      data.residues.residues[result.position]
    ) {
      let residue = data.residues.residues[result.position];
      if (result.fromEnd) {
        residue.info.nbOver++;
        residue.results.end.push(result);
      }
      if (result.fromBegin) {
        residue.info.nbUnder++;
        residue.results.begin.push(result);
      }
    }
  }

  for (let row of data.rows) {
    let maxNbOver = 0;
    let maxNbUnder = 0;

    for (let residue of row.residues) {
      if (residue.info.nbOver > maxNbOver) maxNbOver = residue.info.nbOver;
      if (residue.info.nbUnder > maxNbUnder) maxNbUnder = residue.info.nbUnder;
    }
    row.info.nbOver = maxNbOver;
    row.info.nbUnder = maxNbUnder;
  }
}

module.exports = appendRowsInformation;
