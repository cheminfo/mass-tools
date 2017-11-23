# mf-parser

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![Test coverage][codecov-image]][codecov-url]
  [![David deps][david-image]][david-url]
  [![npm download][download-image]][download-url]
  
Parse molecular formula

## Installation

`$ npm install mf-parser`

## [API Documentation](https://cheminfo-js.github.io/mf-parser/)

## Example

```js
const parseToHtml = require('mf-parser').parseToHtml;
let html = parseToHtml('Et3N . 2HCl);
```

You may also be interested to parse first the MF and then retrieve display representation
```js
const MFParser = require('mf-parser');
let parsed = MFParser.parse('Et3N . 2HCl');
let displayed = MFParser.toDisplay(parsed);
// displayed could be used to ocreate a custom renderer
console.log(displayed);
```


## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/mf-parser.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/mf-parser
[travis-image]: https://img.shields.io/travis/cheminfo-js/mf-parser/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/cheminfo-js/mf-parser
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo-js/mf-parser.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/cheminfo-js/mf-parser
[david-image]: https://img.shields.io/david/cheminfo-js/mf-parser.svg?style=flat-square
[david-url]: https://david-dm.org/cheminfo-js/mf-parser
[download-image]: https://img.shields.io/npm/dm/mf-parser.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/mf-parser
