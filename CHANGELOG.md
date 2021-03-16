# Changelog

### [0.60.1](https://www.github.com/cheminfo/mass-tools/compare/v0.60.0...v0.60.1) (2021-03-16)


### Bug Fixes

* lactame deployment script ([20b5ee1](https://www.github.com/cheminfo/mass-tools/commit/20b5ee1db7e14a09019bf568f719e191c65fcbcd))

## [0.60.0](https://www.github.com/cheminfo/mass-tools/compare/v0.59.2...v0.60.0) (2021-03-15)


### Features

* **mf-parser:** allow to define fractional multiplier ([e999df0](https://www.github.com/cheminfo/mass-tools/commit/e999df00e40f0611d4d0b22f59db40b4e57170c4))


### Bug Fixes

* add --no-verify-access flag to lerna publish ([185234c](https://www.github.com/cheminfo/mass-tools/commit/185234c0c9a88d297f0fec999b32ae5a5d87dd61))

### [0.59.2](https://www.github.com/cheminfo/mass-tools/compare/v0.59.1...v0.59.2) (2021-03-12)


### Bug Fixes

* specify git user.email and user.name in release ([a1cfc91](https://www.github.com/cheminfo/mass-tools/commit/a1cfc918fa0454a58da64d5c75c1fffa1f697af5))

### [0.59.1](https://www.github.com/cheminfo/mass-tools/compare/v0.59.0...v0.59.1) (2021-03-12)


### Bug Fixes

* add --no-ci in lerna bootstrap ([bb600fe](https://www.github.com/cheminfo/mass-tools/commit/bb600fec54b19e63025e29161f1040801e45dfbf))
* build after moving files ([7d00d75](https://www.github.com/cheminfo/mass-tools/commit/7d00d75a60cedd47c80e2fbc7d8e41a38d1fcf8b))
* fix installation of dependencies for eslint check ([09af03f](https://www.github.com/cheminfo/mass-tools/commit/09af03f13343acea99eec11cb61c6f3958a79218))
* missing dependencies ([989220e](https://www.github.com/cheminfo/mass-tools/commit/989220e357ceeeb76181dde823338b53d7cc298f))
* move mass-tools as a normal package for lerna ([301e01b](https://www.github.com/cheminfo/mass-tools/commit/301e01bf731dd592d67e7cf7bee4f10012c1cccd))
* release correctly npm package ([1b286f3](https://www.github.com/cheminfo/mass-tools/commit/1b286f31d7c3442d075f343fd63257fc78dbd5e7))
* test action ([a949379](https://www.github.com/cheminfo/mass-tools/commit/a949379b9fb5e20b704e7bb7e190792acff2814d))

## [0.59.0](https://www.github.com/cheminfo/mass-tools/compare/v0.58.2...v0.59.0) (2021-03-01)


### Features

* **emdb:** setExperimentalSpectrum has an option not to norm the result ([b63e575](https://www.github.com/cheminfo/mass-tools/commit/b63e5750b4568d37026cb8d9c48b209d566791cc))
* **emdb:** setExperimentalSpectrum returns the Spectrum ([25f9e49](https://www.github.com/cheminfo/mass-tools/commit/25f9e49d6b650dfb9ea0247428a2e155bcba096a))

### [0.58.2](https://www.github.com/cheminfo/mass-tools/compare/v0.58.1...v0.58.2) (2021-01-06)


### Bug Fixes

* **emdb:** search pubchem was not taking into account the mass of electron ([8d09531](https://www.github.com/cheminfo/mass-tools/commit/8d0953143fdb5740b5d7b3b23fee41e60e043e69))

### [0.58.1](https://www.github.com/cheminfo/mass-tools/compare/v0.58.0...v0.58.1) (2021-01-06)


### Bug Fixes

* **mf-finder:** wrong calculation of atoms ([c750a76](https://www.github.com/cheminfo/mass-tools/commit/c750a76fa9a34bd1fd09f0b161a30476d51cb828))

## [0.58.0](https://www.github.com/cheminfo/mass-tools/compare/v0.57.0...v0.58.0) (2021-01-06)


### Features

* **mf-finder:** add advanced filtering (callbac) ([4d1c3b2](https://www.github.com/cheminfo/mass-tools/commit/4d1c3b232f6bc5a503e4d63ef93d2a4557801e72))
* **mf-finder:** add atoms and groups in results ([831d4ce](https://www.github.com/cheminfo/mass-tools/commit/831d4ceb0d82fcad61a5ff1b63467edcbb642b16))
* **mf-finder:** add limit options ([e6f3212](https://www.github.com/cheminfo/mass-tools/commit/e6f321287736e808705cdb7d803fe3b775b1d0e9))
* **mf-finder:** filter options object ([6cd7f2b](https://www.github.com/cheminfo/mass-tools/commit/6cd7f2ba64cac14eddc1337fcfdf5b53ea4f8267))
* add callback filter in fromArray ([4a29055](https://www.github.com/cheminfo/mass-tools/commit/4a29055d9b927b59faa06395e471181aebc478aa))
* add callback filter in fromNucleicSequence ([23ca491](https://www.github.com/cheminfo/mass-tools/commit/23ca4917298e5f08a1c742f94e32bb1f3037aa71))
* add callback filter in fromPeptidicSequence ([cec7558](https://www.github.com/cheminfo/mass-tools/commit/cec7558ca04f8e44aa6c957cbdbd729d5f84a6e9))
* add testcase and callback in generateMFs ([26322d7](https://www.github.com/cheminfo/mass-tools/commit/26322d77fb8e6eb9d4eee8667280fe807a82b3ff))
* fromRange allows a callback filter ([ddea80c](https://www.github.com/cheminfo/mass-tools/commit/ddea80c17d4c03af66b6de368e0ee4fa2bd62ad4))


### Bug Fixes

* update dependencies ([44a9baf](https://www.github.com/cheminfo/mass-tools/commit/44a9bafebc6319cb4ef61842dde61ac140b0636d))
* **mf-generator:** documentation for unsaturation filters ([ee5a391](https://www.github.com/cheminfo/mass-tools/commit/ee5a391241c7a7a3d91768498ed4542f1d6ea3f9))
* fix folder name on lactame ([79df00d](https://www.github.com/cheminfo/mass-tools/commit/79df00de3120cc274a3d99bc51f368e56286797c))

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
