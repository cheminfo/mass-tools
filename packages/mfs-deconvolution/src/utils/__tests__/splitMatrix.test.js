import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { splitMatrix } from '../splitMatrix';

describe('splitMatrix', () => {
  it('simple test', () => {
    const matrix = [
      [1, 1, 0, 0],
      [1, 2, 0, 0],
      [0, 0, 1, 1],
    ];
    const matrices = splitMatrix(matrix);
    expect(matrices).toMatchObject([
      { rows: [0, 1], columns: [0, 1] },
      { rows: [2], columns: [2, 3] },
    ]);
    expect(matrices[0].submatrix).toMatchInlineSnapshot(`
      [
        Float64Array [
          1,
          1,
        ],
        Float64Array [
          1,
          2,
        ],
      ]
    `);
  });

  it('simple test', () => {
    const matrix = [
      [1, 0, 0, 1],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
    ];
    const matrices = splitMatrix(matrix);
    expect(matrices).toMatchObject([
      { rows: [0, 2, 1], columns: [0, 3, 2, 1] },
    ]);
  });

  it('complex case', () => {
    const combined = JSON.parse(
      readFileSync(path.join(__dirname, './data/combined.json'), 'utf8'),
    );
    // first row are the target values
    const matrix = combined.ys.slice(1);
    const result = splitMatrix(matrix);
    expect(result).toHaveLength(122);
  });
});
