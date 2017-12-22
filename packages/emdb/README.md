# emdb

  [![NPM version][npm-image]][npm-url]
  [![npm download][download-image]][download-url]

Database manager for exact mass query.

## Installation

`$ npm install --save emdb`


The following fields in the json are expected to be returned
* id
* url: optional external link
* mf
* em
* mw
* msem: calculated from em and charge
* charge
* ocl: either a string or an object with value / coordinates
* parts: array of mf if the mf is the result of a combination of mf
* info: object of free information
* filter: optional information about the kind of mass spectra that yields to this mass
  * ESI
  * MALDI
  * positive
  * negative

## Usage

```js
import library from 'emdb';

const result = library(args);
// result is ...
```

## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/emdb.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/emdb
[download-image]: https://img.shields.io/npm/dm/emdb.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/emdb
