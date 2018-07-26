# emdb

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

Database manager for molecular formula with various query feature.

## Installation

`npm install --save emdb`

## Using the project

There are 2 parts:

- adding databases in the database manager
- checking the databases
- searching the databases

### Adding database in the database manager

```
  const emdb = require('emdb');

  emdb.loadTest();  // add a database named test containing all the molecular formula from C1 to C100
```

#### loadTest

A method that allows to create a database named 'test' and that contains all the molecular formula from C1 to C100

#### loadKnapSack

#### loadCommercials

#### loadContaminants

#### fromArray

#### loadGoogleSheet

## Static methods

### EMDB.Util.MF

Example:

```
var mf = new EMDB.Util.MF('Et3N');
```

### EMDB.Util.IsotopicDistribution

A method that creates a database (by default named `generated`) that contains all the posible combination based on an array of strings.

```
  emdb.fromArray( ['C1-10','N1-10']);
```

This method use the project 'mf-generator'

The following fields in the json are expected to be returned

- id
- url: optional external link
- mf
- em
- mw
- msem: calculated from em and charge
- charge
- ocl: either a string or an object with value / coordinates
- comment: if in the molecular formula there is a '$' this will end-up in this field
- parts: array of mf if the mf is the result of a combination of mf
- info: object of free information
- filter: optional information about the kind of mass spectra that yields to this mass
  - ESI
  - MALDI
  - positive
  - negative

### EMDB.Util.Peptide

#### EMDB.Util.Peptide.sequenceToMF

Generates a molecular formula from a peptidic sequence.

Example:

```
const Peptide = require('emdb').Util.Peptide;
let mf = Peptide.mfFromSequence('AAA');
// mf = HAlaAlaAlaOH
```

### EMDB.Util.Nucleotide

#### EMDB.Util.Nucleotide.sequenceToMF

Generates a molecular formula from a nucleotide sequence.

Example:

```
const Nucleotide = require('emdb').Util.Nucleotide;
let mf = Nucleotide.mfFromSequence('AAA', {circular: false, kind: 'dna'});
// mf = HODampDampDampH
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/emdb.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/emdb
[download-image]: https://img.shields.io/npm/dm/emdb.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/emdb
