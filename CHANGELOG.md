# Changelog

## [0.57.0](https://www.github.com/cheminfo/mass-tools/compare/v0.56.1...v0.57.0) (2021-01-05)


### Features

* add callback in msemMatcher ([cca73e9](https://www.github.com/cheminfo/mass-tools/commit/cca73e9bada5c1b61389da652206ca72d5cc22f1))
* allow to filter using callback in searchMSEM and searchSimilarity ([4b48fc2](https://www.github.com/cheminfo/mass-tools/commit/4b48fc2831607eeae97b8c5e452caa96b73bb747))


### Bug Fixes

* RENAME BUILD from molecular-formula to mass-tools ([e86542c](https://www.github.com/cheminfo/mass-tools/commit/e86542c5e753f3edea1457b212f2b8d14c05f2b7))

### [0.56.1](https://www.github.com/cheminfo/mass-tools/compare/v0.56.0...v0.56.1) (2020-11-24)


### Bug Fixes

* **mf-from-ea:** Deal correctly with undefined targets ([611615f](https://www.github.com/cheminfo/mass-tools/commit/611615fe4e0bae9567ffcab2524b2734a63eddee))

## [0.56.0](https://www.github.com/cheminfo/mass-tools/compare/v0.55.2...v0.56.0) (2020-11-24)


### Features

* add mfFromEA in readme ([2a9a083](https://www.github.com/cheminfo/mass-tools/commit/2a9a083ea9a47dafb039af8c794fbbdf297d8fd5))
* **mass-tools:** add mfFromEA ([678c079](https://www.github.com/cheminfo/mass-tools/commit/678c079fc83a55dbfa624a5c92d0c64e5d486250))
* **mf-from-ea:** Improve speed ([3d236cd](https://www.github.com/cheminfo/mass-tools/commit/3d236cd156e464a5673c121bfa8e5d3520979a2b))
* **mf-from-ea:** return results sorted by totalError ([d19c017](https://www.github.com/cheminfo/mass-tools/commit/d19c017148f8779cb3428d6630877dd406104a0e))
* addming mf-from-ea ([fb127be](https://www.github.com/cheminfo/mass-tools/commit/fb127becedb3cc4d27fbe66dff07d3c59be12d78))


### Bug Fixes

* **mf-from-ea:** improve README ([3d926d8](https://www.github.com/cheminfo/mass-tools/commit/3d926d80095200df6ccb9f1ece646229d5661380))

### [0.55.2](https://www.github.com/cheminfo/mass-tools/compare/v0.55.1...v0.55.2) (2020-11-23)


### Bug Fixes

* custom build and keep molecular-formula on lacdtame ([2b3f39c](https://www.github.com/cheminfo/mass-tools/commit/2b3f39c2fa2626406526d1db16015e9f5f72c5ae))

### [0.55.1](https://www.github.com/cheminfo/molecular-formula/compare/v0.55.0...v0.55.1) (2020-11-23)


### Bug Fixes

* try to rename to mass-tools because npm does not want to publish it ([bfc094d](https://www.github.com/cheminfo/molecular-formula/commit/bfc094d190d39f40798a7156a8ff8191145f01ab))

## [0.55.0](https://www.github.com/cheminfo/molecular-formula/compare/v1.0.1...v0.55.0) (2020-11-23)


### Features

* improve filterFct in generateMFs ([b177219](https://www.github.com/cheminfo/molecular-formula/commit/b177219eaad544e848074c71380471003ea302a5))
* **matcher:** add filterFct ([fd9fb68](https://www.github.com/cheminfo/molecular-formula/commit/fd9fb68c2b7b6d3bfdd6e5b519893af65c53c6b4))
* add furan phosphate ([7887c9a](https://www.github.com/cheminfo/molecular-formula/commit/7887c9ac2cbd6f034aaa496f234aa696ade55487))
* add Lxx for isoleucine or leucine ([1c43d85](https://www.github.com/cheminfo/molecular-formula/commit/1c43d851116516b89d83a1862ba354b7767abec5))
* add mfDiff ([f082f57](https://www.github.com/cheminfo/molecular-formula/commit/f082f57f8fe269116ea483b009697e89d3d67a33))
* add more groups ([1e81ac4](https://www.github.com/cheminfo/molecular-formula/commit/1e81ac460b447d730cac7b8d65fea4a6ec69e7f2))
* add types in groups.tsv ([5941d60](https://www.github.com/cheminfo/molecular-formula/commit/5941d60b090a1994e7fe198c9b62d420b4bdda74))
* allow to specifiy isotopes in ranges ([3a5552d](https://www.github.com/cheminfo/molecular-formula/commit/3a5552d6b11659d5d85277befe5b675337667bf8))
* deal with fromNucleicSequence of modified base ([041b93f](https://www.github.com/cheminfo/molecular-formula/commit/041b93f35776bebf605a0909ff2800ded4ec1a3c))
* isotopicDistribution - add options to getTable ([03a0da1](https://www.github.com/cheminfo/molecular-formula/commit/03a0da1ad946fb235e6f9f27ed12373622b1f52c))
* replace furanThreeTerm by group Furp ([b1efb06](https://www.github.com/cheminfo/molecular-formula/commit/b1efb061128833cd7d04772ed8f67102819e1f28))
* **nucleotide:** add ensureUppercaseSequence ([23b60d1](https://www.github.com/cheminfo/molecular-formula/commit/23b60d17a50dcc8e32b064b07d762b87f7561e51))
* **nucleotide:** sequence to MF deals with other oneLetter code ([0bfd369](https://www.github.com/cheminfo/molecular-formula/commit/0bfd3696527335b6696834210af710a8805c53cd))
* calculate sequence in fromPeptidic and fromNucleic ([078e60e](https://www.github.com/cheminfo/molecular-formula/commit/078e60e593e77a253f54e330c999213f523129b0))
* combine base loss and change nomenclature ([8dedc39](https://www.github.com/cheminfo/molecular-formula/commit/8dedc39b14655cc3f6e0016102eabe2b1373a7b0))
* expose getPeaks and getBestPeaks ([233678a](https://www.github.com/cheminfo/molecular-formula/commit/233678ab093952ef94855ba63f79a1854d8aa1b5))
* limit number of generated MF ([d361ed7](https://www.github.com/cheminfo/molecular-formula/commit/d361ed75f1d129fda64b19c2ee3cd421486aeeac))
* throw in getGaussian if to big array ([f80d76b](https://www.github.com/cheminfo/molecular-formula/commit/f80d76b1efdf34196749c202397fe48b8a71fe52))
* working on non exaustive baseloss for nucleotide ([0e8d2fa](https://www.github.com/cheminfo/molecular-formula/commit/0e8d2fa67ee33096091b1a245d21c213f3f4456b))


### Bug Fixes

* add spaces around salt bullet for display ([43499ab](https://www.github.com/cheminfo/molecular-formula/commit/43499ab89a7f6194583519fada8ec010026bd8d6))
* add test-coverage ([52e18b8](https://www.github.com/cheminfo/molecular-formula/commit/52e18b81232ece9a7873d591630eee2fd56398ec))
* bug on squenceSVG for modified peptides ([95aebb8](https://www.github.com/cheminfo/molecular-formula/commit/95aebb85539f35b6918e2e9e72ea677a88bc5721))
* correcly use Xle and J for Lys / Ile ([e1b2250](https://www.github.com/cheminfo/molecular-formula/commit/e1b22501ab01151d48d5e07ee22017f08e3102a9))
* do not calculate combined if estimate ([b96535a](https://www.github.com/cheminfo/molecular-formula/commit/b96535ae9b4845d8ebb76f94811d5a41ecdad069))
* fromNucleicSequence estimate bug ([01ae485](https://www.github.com/cheminfo/molecular-formula/commit/01ae48564890d0545863261114b30ad20c8573a6))
* groups containing twice phosphate ([2267e69](https://www.github.com/cheminfo/molecular-formula/commit/2267e69d22dfd92214904bc2a868557866022eea))
* limit database generation to 100000 ([6e3eed3](https://www.github.com/cheminfo/molecular-formula/commit/6e3eed36564e7cbee5ad06c3f71621aff759f7c3))
* problem with spectrumGenerator and integer nbPoints ([eed40df](https://www.github.com/cheminfo/molecular-formula/commit/eed40df3ec46f45d068eae9f09708d1c469900d0))
* some groups description ([36f8427](https://www.github.com/cheminfo/molecular-formula/commit/36f842706b62314135bc4238ea27872a67633513))
* **nucleotide:** problem with HO and H in sequence ([8e16119](https://www.github.com/cheminfo/molecular-formula/commit/8e161194d4f1c7e5a4aedf944a1cddccd430d4d7))
* svg color for similarity if merge ([a043c15](https://www.github.com/cheminfo/molecular-formula/commit/a043c158a58727603135054ff77b5ebed398cfea))
* **chemical-elements:** leave unstable istopes ([39a6f5b](https://www.github.com/cheminfo/molecular-formula/commit/39a6f5bfca4f48425c7bc44330ee2f33caf52c28))
