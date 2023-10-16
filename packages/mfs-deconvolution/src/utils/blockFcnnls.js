import { fcnnlsVector } from 'ml-fcnnls';
import { Matrix } from 'ml-matrix';

import { splitMatrix } from './splitMatrix.js';

export function blockFcnnls(fullMatrix) {
  const target = fullMatrix[0];
  const originalMatrix = fullMatrix.slice(1);
  const matrix = [];
  const emptyRow = new Float64Array(originalMatrix[0].length);
  row: for (const row of originalMatrix) {
    for (let i = 0; i < row.length; i++) {
      if (row[i] !== 0 && target[i] !== 0) {
        matrix.push(row);
        continue row;
      }
    }
    matrix.push(emptyRow);
  }

  // if there is no match with first spectrum we just ignore this entry
  const matrices = splitMatrix(matrix);
  appendTarget(matrices, target);

  const weights = new Float64Array(matrix.length);
  const reconstructed = new Float64Array(target.length);

  for (const entry of matrices) {
    const A = new Matrix(entry.submatrix);
    const At = A.transpose();
    const b = Array.from(entry.target); // target

    const w = fcnnlsVector(At, b);
    const W = new Matrix([w]); // weights
    const partialReconstructed = W.mmul(A).getRow(0);
    for (let i = 0; i < entry.columns.length; i++) {
      reconstructed[entry.columns[i]] = partialReconstructed[i];
    }
    for (let i = 0; i < entry.rows.length; i++) {
      weights[entry.rows[i]] = w[i];
    }
  }
  return {
    reconstructed,
    weights,
  };
}

function appendTarget(matrices, target) {
  for (const entry of matrices) {
    entry.target = [];
    for (let column of entry.columns) {
      entry.target.push(target[column]);
    }
  }
}
