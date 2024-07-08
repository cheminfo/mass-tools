/**
 * For each row we calculate internals, label over and label under
 * @param {*} data
 */
export function appendRowsInformation(data) {
  for (let row of data.rows) {
    let filtered = row.residues.filter(
      (entry) => entry.fromBegin !== undefined,
    );
    if (filtered.length > 0) {
      row.info.firstResidue = filtered[0].fromBegin;
      row.info.lastResidue = filtered.at(-1).fromBegin;
    }
    row.internals = [];
  }

  for (let result of data.results) {
    if (result.internal) {
      let fromResidue = data.residues.residues[result.from];
      let from = fromResidue.fromBegin;
      let toResidue = data.residues.residues[result.to];
      let to = toResidue.fromBegin;
      for (let row of data.rows) {
        if (from <= row.info.lastResidue && to >= row.info.firstResidue) {
          result = structuredClone(result);
          result.fromResidue = fromResidue;
          if (from < row.info.firstResidue) {
            result.firstIndex = true;
          } else {
            for (const [index, residue] of row.residues.entries()) {
              if (residue.fromBegin === from) {
                result.firstIndex = index;
              }
            }
          }
          result.toResidue = toResidue;
          if (to > row.info.lastResidue) {
            result.lastIndex = true;
          } else {
            for (const [index, residue] of row.residues.entries()) {
              if (residue.fromBegin === to) {
                result.lastIndex = index;
              }
            }
          }
          row.internals.push(result);
        }
      }
    } else if (
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
