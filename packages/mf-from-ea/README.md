# mf-from-ea

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

Find a molecular formula from the result of an elemental analysis based on a molecular formula range.

## Installation

`$ npm install --save mf-from-ea`

## Usage

```js
let result = mfFromEA(
  { C: 0.8, H: 0.2 }, // elemental analysis result: 80% C, 20% H
  {
    ranges: 'C0-10 H0-20', // range of molecular formula to explore
    maxElementError: 0.003, // 0.3% Allowed error for each element
    maxTotalError: 0.01, // 1% total error (absolute sum of element errors)
  },
);

console.log(result);
/*
{
  mfs: [
    { mf: 'CH3', totalError: 0.002249567989705492, ea: [Array] },
    { mf: 'C2H6', totalError: 0.002249567989705492, ea: [Array] },
    { mf: 'C3H9', totalError: 0.002249567989705409, ea: [Array] },
    { mf: 'C4H12', totalError: 0.002249567989705492, ea: [Array] },
    { mf: 'C5H15', totalError: 0.002249567989705492, ea: [Array] },
    { mf: 'C6H18', totalError: 0.002249567989705409, ea: [Array] }
  ],
  info: { numberMFEvaluated: 231, numberResults: 6 }
}
*/
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/mf-from-ea.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/mf-from-ea
[download-image]: https://img.shields.io/npm/dm/mf-from-ea.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/mf-from-ea
