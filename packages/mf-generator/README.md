# mf-generator

  [![NPM version][npm-image]][npm-url]
  [![npm download][download-image]][download-url]

.

## Installation

`$ npm install --save mf-generator`

## Usage

```js
import generateMFs from 'mf-generator';

const mfsArray = ['C,H,', 'Cl,Br'];
const result = generateMFs(mfsArray).map((entry) => entry.mf);
// result = 'Cl', 'HCl', 'CCl', 'Br', 'HBr', 'CBr'

```

## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/mf-generator.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/mf-generator
[download-image]: https://img.shields.io/npm/dm/mf-generator.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/mf-generator
