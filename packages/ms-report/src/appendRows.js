function appendRows(data) {
  let allResidues = data.residues.all.sort((a, b) => a.line - b.line);
  data.rows = [];
  for (let residue of allResidues) {
    let line = residue.paper.line;
    if (!data.rows[line]) {
      data.rows[line] = {
        residues: [],
      };
    }
    data.rows[line].residues.push(residue);
  }
  for (let row of data.rows) {
    row.info = {};
  }
}

module.exports = appendRows;
