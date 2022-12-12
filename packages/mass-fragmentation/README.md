# mass-fragmentation

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

## Installation

`$ npm install --save mass-fragmentation`

## Usage

```js
const { fragment } require('mass-fragmentation');
const { Molecule } require('openchemlib');

const molecule = Molecule.fromSmiles('CCCCC');
const fragments = fragment(molecule);
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/mass-fragmentation.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/mass-fragmentation
[download-image]: https://img.shields.io/npm/dm/mass-fragmentation.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/mass-fragmentation
