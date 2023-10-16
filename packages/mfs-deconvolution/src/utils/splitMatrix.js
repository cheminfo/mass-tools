export function splitMatrix(matrix) {
  const nbRows = matrix.length;
  const nbColumns = matrix[0].length;
  const { nonZeroColumns, nonZeroRows } = createMatrixIndexes(matrix);

  const rowsMapping = new Int32Array(nbRows).fill(-1);
  const columnsMapping = new Int32Array(nbColumns).fill(-1);
  const matrices = [];

  let currentMappingID = 0;
  for (let row = 0; row < matrix.length; row++) {
    for (let column of nonZeroColumns[row]) {
      if (matrix[row][column] === 0) {
        continue;
      }
      if (rowsMapping[row] !== -1) {
        continue;
      }
      if (columnsMapping[column] !== -1) {
        continue;
      }
      currentMappingID++;
      const result = { rows: [], columns: [] };
      matrices.push(result);
      processFromACell(
        row,
        rowsMapping,
        columnsMapping,
        currentMappingID,
        nonZeroColumns,
        nonZeroRows,
        result,
      );
    }
  }
  appendSubMatrix(matrices, matrix);
  return matrices;
}

function appendSubMatrix(matrices, matrix) {
  for (const entry of matrices) {
    const submatrix = new Array(entry.rows.length)
      .fill(0)
      .map(() => new Float64Array(entry.columns.length));
    for (let i = 0; i < entry.rows.length; i++) {
      for (let j = 0; j < entry.columns.length; j++) {
        submatrix[i][j] = matrix[entry.rows[i]][entry.columns[j]];
      }
    }
    entry.submatrix = submatrix;
  }
}

function processFromACell(
  row,
  rowsMapping,
  columnsMapping,
  currentMappingID,
  nonZeroColumns,
  nonZeroRows,
  result,
) {
  const rowsTodo = [row];
  let nextRow;
  while ((nextRow = rowsTodo.pop()) !== undefined) {
    result.rows.push(nextRow);
    for (let column of nonZeroColumns[nextRow]) {
      if (columnsMapping[column] !== -1) {
        continue;
      }
      rowsMapping[nextRow] = currentMappingID;
      columnsMapping[column] = currentMappingID;
      result.columns.push(column);
      for (let internalRow of nonZeroRows[column]) {
        if (rowsMapping[internalRow] === -1) {
          if (!rowsTodo.includes(internalRow)) {
            rowsTodo.push(internalRow);
          }
          continue;
        }
        if (rowsMapping[internalRow] !== currentMappingID) {
          throw new Error('This should not happen');
        }
      }
    }
  }
}

function createMatrixIndexes(matrix) {
  const nbRows = matrix.length;
  const nbColumns = matrix[0].length;
  const nonZeroColumns = new Array(nbRows).fill(0).map(() => []);
  const nonZeroRows = new Array(nbColumns).fill(0).map(() => []);
  for (let row = 0; row < nbRows; row++) {
    for (let column = 0; column < nbColumns; column++) {
      if (matrix[row][column] === 0) {
        continue;
      }
      nonZeroColumns[row].push(column);
      nonZeroRows[column].push(row);
    }
  }
  return { nonZeroColumns, nonZeroRows };
}
