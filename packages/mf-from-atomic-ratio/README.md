# mf-from-atomic-ratio

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

Find a molecular formula from atomic ratio based on a molecular formula range.

## Installation

`$ npm install --save mf-from-atomic-ratio`

## Usage

```js
const { mfFromAtomicRatio } = require('mf-from-atomic-ratio');

const mfs = await mfFromAtomicRatio(
  { C: 2, O: 1.1 },
  {
    ranges: 'C0-10 O0-10',
  },
);

console.log(mfs.map((mf) => mf.mf).join(', '));
// C9O5, C7O4, C5O3, C10O6, C2O, C4O2, C6O3, C8O4, C10O5, C8O5, C3O2, C6O4, C9O6, C9O4
console.log(mfs[0]);
/*
{
  em: 187.97457309785,
  mw: 188.0936476922086,
  mf: 'C9O5',
  mfAtomicComposition: [
    { element: 'C', count: 9, theoretical: 0.6428571428571429 },
    { element: 'O', count: 5, theoretical: 0.35714285714285715 }
  ],
  atomicRatios: [
    {
      element: 'C',
      experimental: 0.6451612903225806,
      count: 9,
      theoretical: 0.6428571428571429,
      error: -0.0023041474654377225
    },
    {
      element: 'O',
      experimental: 0.3548387096774194,
      count: 5,
      theoretical: 0.35714285714285715,
      error: 0.002304147465437778
    }
  ],
  totalError: 0.004608294930875501
}
*/
```

The ratios may be given at any scale. Each result holds the formula (`mf`,
`em`, `mw`) and:

- `mfAtomicComposition`: every element of the formula, its `count` and its
  share of all the atoms of the formula (`theoretical`);
- `atomicRatios`: every element of the given ratios, its `count` in the
  formula, its given share (`experimental`), its share in the formula
  (`theoretical`) and `error`, `theoretical` minus `experimental`;
- `totalError`: the sum of the absolute errors, by which the results are
  sorted.

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/mf-from-atomic-ratio.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/mf-from-atomic-ratio
[download-image]: https://img.shields.io/npm/dm/mf-from-atomic-ratio.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/mf-from-atomic-ratio
