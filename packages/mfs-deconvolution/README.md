#

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

Allows de determine exact mfs composition in a complex mass spectrum.

## Installation

`$ npm install --save mfs-deconvolution`

## Usage

```js
import { mfsDeconvolution } from 'mfs-deconvolution';

const text = `
118.0862551	93.8304348
119.0895773	53.0406383
120.0928776	22.0264302
121.0962318	10.6894394
122.0985382	0.3660362
123.1005595	0.0457434
124.1030759	0.0012204
125.1049106	0.0000538
126.1074497	0.0000011
`;
const spectrum = new Spectrum(parseXY(text));

const { mfs } = await mfsDeconvolution(spectrum, ['HValOH', '([13C]C-1)0-10']);
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/mfs-deconvolution.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/mfs-deconvolution
[download-image]: https://img.shields.io/npm/dm/mfs-deconvolution.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/mfs-deconvolution
