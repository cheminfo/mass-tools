# mass-tools

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
