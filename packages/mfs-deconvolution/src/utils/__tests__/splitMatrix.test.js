import { readFileSync } from 'fs';
import { join } from 'path';

import { splitMatrix } from '../splitMatrix';

describe('splitMatrix', () => {
  it('simple test', () => {
    const matrix = [
      [1, 1, 0, 0],
      [1, 2, 0, 0],
      [0, 0, 1, 1],
    ];
    const result = splitMatrix(matrix);
    expect(result.matrices).toMatchObject([
      { rows: [0, 1], columns: [0, 1] },
      { rows: [2], columns: [2, 3] }
    ])
    expect(result.matrices[0].submatrix).toMatchInlineSnapshot(`
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
    `)
  })


  it('simple test', () => {
    const matrix = [
      [1, 0, 0, 1],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
    ];
    const result = splitMatrix(matrix);
    expect(result.matrices).toMatchObject([{ rows: [0, 2, 1], columns: [0, 3, 2, 1] }])
  })


  it('complex case', () => {
    const combined = JSON.parse(readFileSync(join(__dirname, './data/combined.json'), 'utf8'))
    console.log(combined.ys.length, combined.ys[0].length)
    // first row are the target values
    const matrix = combined.ys.slice(1)
    console.time('matrix')
    const result = splitMatrix(matrix);
    console.timeEnd('matrix')
    console.log(result.maxMappingID)
  })
})