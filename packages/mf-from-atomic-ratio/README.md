# mf-from-atomic-ratio

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

Find a molecular formula from atomic ratio based on a molecular formula range.

## Installation

`$ npm install --save mf-from-atomic-ratio`

## Usage

```js
const { mfFromAtomicRatio } = requier('mf-from-atomic-ratio');

const mfs = await mfFromAtomicRatio(
  { C: 3, O: 2 },
  {
    ranges: 'C0-10 H0-10 O0-10 N0-10',
    maxElementError: 0.01,
    maxTotalError: 0.02,
  },
);

console.log(mfs[0]);
/*
{
  em: 13.00782503223,
  mw: 13.018676650791026,
  mf: 'CH',
  mfAtomicComposition: [
    { element: 'C', count: 1, theoretical: 0.5 },
    { element: 'H', count: 1, theoretical: 0.5 }
  ],
  atomicRatios: [
    {
      element: 'C',
      experimental: 0.5,
      count: 1,
      theoretical: 0.5,
      error: 0
    },
    {
      element: 'H',
      experimental: 0.5,
      count: 1,
      theoretical: 0.5,
      error: 0
    }
  ],
  totalError: 0
}
*/
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/mf-from-atomic-ratio.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/mf-from-atomic-ratio
[download-image]: https://img.shields.io/npm/dm/mf-from-atomic-ratio.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/mf-from-atomic-ratio
