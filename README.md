# mass-tools

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![DOI](https://www.zenodo.org/badge/111557358.svg)](https://www.zenodo.org/badge/latestdoi/111557358)

Various tools allowing to manipulate molecular formula and analyse mass spectra.

The library is published as a full package on npm as `mass-tools`.

It is also published for the browser on the CDN https://www.lactame.com.

The library contains the following tools:

- EMDB: database of molecular formula
- Groups: List of groups understood by the package
- Elements: Periodic table elements with associated mw and atomic mass
- IsotopicDistribution: Package to create isotopic distribution
- MF: Parse and format molecular formula
- Peptide: Parse peptide sequences
- Nucleotide: Parse nucleic sequences
- Spectrum: Deal with mass spectrum
- getPeaks: Filter array of peaks
- getBestPeaks: Get the best peaks of an array of peaks
- generateMFs: Generate all possible molecular formula
- Report: Generate fragmentation reports
- atomSorter: Sort symbol of atoms
- mfFromEA: Determine molecular formula from elemental analysis

This package should not be installed as we provide many specific packages with the different tools.

- EMDB: `npm i emdb`
- Elements / Groups: `npm i chemical-groups`
- IsotopicDistribution: `npm i isotopic-distribution`
- MF: `npm i mf-parser`
- Peptide: `npm i peptide`
- Nucleotide: `npm i nucleotide`
- Spectrum: `npm i ms-spectrum`
- generateMFs: `npm i mf-generator`
- Report: `npm i ms-report`
- atomSorter: `npm i atom-sorter`

## License

[MIT](./LICENSE)


[npm-image]: https://img.shields.io/npm/v/mass-tools.svg
[npm-url]: https://npmjs.org/package/mass-tools
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/mass-tools.svg
[codecov-url]: https://codecov.io/gh/cheminfo/mass-tools
[ci-image]: https://github.com/cheminfo/mass-tools/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/mass-tools/actions?query=workflow%3A%22Node.js+CI%22
[download-image]: https://img.shields.io/npm/dm/mass-tools.svg
[download-url]: https://npmjs.org/package/mass-tools
