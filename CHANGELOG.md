# Changelog

## [5.3.0](https://www.github.com/cheminfo/mass-tools/compare/v5.2.1...v5.3.0) (2022-02-02)


### Features

* **mf-matcher:** add property allowNegativeAtoms ([58cc28c](https://www.github.com/cheminfo/mass-tools/commit/58cc28c81a34ae8910e60610ba416ecfb082fb48))
* **mf-utilities:** preprocessIonizations add atoms property ([85fdcb1](https://www.github.com/cheminfo/mass-tools/commit/85fdcb1f592ed7f9d3909f547264d8ed5a780f3f))

### [5.2.1](https://www.github.com/cheminfo/mass-tools/compare/v5.2.0...v5.2.1) (2022-02-01)


### Bug Fixes

* better deal with non possible isotopic distribution (negative number of atoms) ([7bb9d6b](https://www.github.com/cheminfo/mass-tools/commit/7bb9d6bc590e0ef5e8f106b232b884024a461bde))

## [5.2.0](https://www.github.com/cheminfo/mass-tools/compare/v5.1.1...v5.2.0) (2022-01-28)


### Features

* **emdb:** allow many monoisotopic mass in searchPubchem ([76346ab](https://www.github.com/cheminfo/mass-tools/commit/76346abf6ff5c2d8df57b8a2d77949da2f974e2f))

### [5.1.1](https://www.github.com/cheminfo/mass-tools/compare/v5.1.0...v5.1.1) (2022-01-25)


### Bug Fixes

* **emdb:** onStep option was not forwarded ([7e1674e](https://www.github.com/cheminfo/mass-tools/commit/7e1674e61858a48f64ced159d0899e6f5ec11a6d))

## [5.1.0](https://www.github.com/cheminfo/mass-tools/compare/v5.0.0...v5.1.0) (2022-01-25)


### Features

* **ms-spectrum:** add sumValue option in getPeaks ([bf2209d](https://www.github.com/cheminfo/mass-tools/commit/bf2209dfef341b91e5ced101c87572d9d4e0a7fe))


### Bug Fixes

* **emdb:** appendFragmentsInfo will first normalize peaks ([c88a07f](https://www.github.com/cheminfo/mass-tools/commit/c88a07ff1e48d989e73dbaa9e8af0217c978f18a))

## [5.0.0](https://www.github.com/cheminfo/mass-tools/compare/v4.3.0...v5.0.0) (2022-01-25)


### ⚠ BREAKING CHANGES

* searchSimilarity is now async
* emdb.fromXYZ are async
* mf-generator is now async and allow an onStep callback

### Features

* emdb.fromXYZ are async ([ff39358](https://www.github.com/cheminfo/mass-tools/commit/ff39358a8e5d3d9f5f10d5444f59cf6cc198a60f))
* **emdb:** add method to appendFragmentsInfo ([4d54959](https://www.github.com/cheminfo/mass-tools/commit/4d5495936c2d3e9d1ebeb2a3d44381fc428b9501))
* mf-generator is now async and allow an onStep callback ([a9dbc39](https://www.github.com/cheminfo/mass-tools/commit/a9dbc396cd5e5f441490a19cc1912e5d1ee4c5c6))
* searchSimilarity is now async ([8e5ec53](https://www.github.com/cheminfo/mass-tools/commit/8e5ec5300362ca74bb76a44dbf25ad19233d4fb2))

## [4.3.0](https://www.github.com/cheminfo/mass-tools/compare/v4.2.1...v4.3.0) (2022-01-21)


### Features

* **emdb:** allow to find MF from a list of monoisotopic masses ([f301b43](https://www.github.com/cheminfo/mass-tools/commit/f301b43c0b942f6d28fcd976ca0f8f9c29a3dff4))
* remove compatibility with node 10 ([67a770a](https://www.github.com/cheminfo/mass-tools/commit/67a770a9e2c0188689948a2b01fa9f27d1b68c44))

### [4.2.1](https://www.github.com/cheminfo/mass-tools/compare/v4.2.0...v4.2.1) (2022-01-19)


### Bug Fixes

* correct search pubchem with negative charges ([d27332a](https://www.github.com/cheminfo/mass-tools/commit/d27332a5e10c54708f7c8e9b22c382d149d2c461))

## [4.2.0](https://www.github.com/cheminfo/mass-tools/compare/v4.1.1...v4.2.0) (2022-01-18)


### Features

* **ms-report:** allow to specify minimum quantity ([4df34c0](https://www.github.com/cheminfo/mass-tools/commit/4df34c0112d782198ed1ffdf732b920f74e1d1aa))

### [4.1.1](https://www.github.com/cheminfo/mass-tools/compare/v4.1.0...v4.1.1) (2022-01-18)


### Bug Fixes

* **isotopic-distribution:** getXY with no peaks ([8f8b9e5](https://www.github.com/cheminfo/mass-tools/commit/8f8b9e59378ce13c885088089ddfcd43eb8d7df6))

## [4.1.0](https://www.github.com/cheminfo/mass-tools/compare/v4.0.0...v4.1.0) (2022-01-17)


### Features

* allow peptidic sequence to filter on parts using filter.callback ([bd6d84b](https://www.github.com/cheminfo/mass-tools/commit/bd6d84b7ea94c09c10f6b0cdd7e28cdd6a3fc532))

## [4.0.0](https://www.github.com/cheminfo/mass-tools/compare/v3.1.0...v4.0.0) (2022-01-17)


### ⚠ BREAKING CHANGES

* **ms-report:** similarity should be given as a number between 0 and 1

### Features

* add filter for SVG ([cf5d74a](https://www.github.com/cheminfo/mass-tools/commit/cf5d74a1aa4db727ad4cb0aeab0670bf2ecae63a))
* **ms-report:** similarity should be given as a number between 0 and 1 ([c1f8735](https://www.github.com/cheminfo/mass-tools/commit/c1f8735ee681c858fbc426b542a1635e41fdcee7))

## [3.1.0](https://www.github.com/cheminfo/mass-tools/compare/v3.0.0...v3.1.0) (2021-12-24)


### Features

* add getPeaks in isotopicDistribution ([588ba2d](https://www.github.com/cheminfo/mass-tools/commit/588ba2d1f49d9ae9b25162ee4468b370a069ca0f))

## [3.0.0](https://www.github.com/cheminfo/mass-tools/compare/v2.0.0...v3.0.0) (2021-10-10)


### ⚠ BREAKING CHANGES

* peakPicking returns all the properties from data

### Features

* add MF toText and toCanonicText ([112f3da](https://www.github.com/cheminfo/mass-tools/commit/112f3da633534a9b4fe6a155e16c6d2324b29123))
* **chemical-elements:** add stableIsotopesObject ([1dfead4](https://www.github.com/cheminfo/mass-tools/commit/1dfead4899b501adfc27e8f4a94e13c394b47402))
* **isotopic-distribution:** add composition in isotopes ([3ab41ba](https://www.github.com/cheminfo/mass-tools/commit/3ab41baa11e9bdf8836cab3a5d404a817ee29807))
* **isotopic-distribution:** add label, shortComposition, shortLabel, composition as peak properties ([ef4dbbc](https://www.github.com/cheminfo/mass-tools/commit/ef4dbbcf74235ec9d15c154d1cc674684bac7bb3))
* **isotopic-distribution:** change composition to a string ([4606329](https://www.github.com/cheminfo/mass-tools/commit/460632960b3179573eeb828dd4ae66f6f1d0f176))
* **isotopic-distribution:** getXY returns also other existing arrays ([f6714b1](https://www.github.com/cheminfo/mass-tools/commit/f6714b1b8ec937fc8b1afe828e9ff72adb7346b3))
* **mf-parser:** expose subscript / superscript UTF8 mapping ([cf009c9](https://www.github.com/cheminfo/mass-tools/commit/cf009c929c1b38cb80425b8ad46e325bbc9be754))
* **ms-spectrum:** add Spectrum.fromPeaks ([b2dc1db](https://www.github.com/cheminfo/mass-tools/commit/b2dc1db517fda6e04248c0bbfc4bd1954bc0867b))
* peakPicking returns all the properties from data ([52df8a0](https://www.github.com/cheminfo/mass-tools/commit/52df8a046b22304821a53367c91479817fc095e7))


### Bug Fixes

* **chemical-elements:** correct name stableIsotopesObject ([ca0aa26](https://www.github.com/cheminfo/mass-tools/commit/ca0aa26fb8dbb826ad0d2fc96ab9aed03db92757))
* incorrectly replace unnamed function by arrow function ([2e1082e](https://www.github.com/cheminfo/mass-tools/commit/2e1082e5315602ce7f67d115b8627e329273804f))

## [2.0.0](https://www.github.com/cheminfo/mass-tools/compare/v1.1.1...v2.0.0) (2021-10-04)


### ⚠ BREAKING CHANGES

* mf-global exports groups and elements (and not Groups and Elements)

### Features

* add getMassRemainder ([e5be1ab](https://www.github.com/cheminfo/mass-tools/commit/e5be1abf725c5b8965c293bdd0d7212e8fcb2d98))


### Bug Fixes

* getMassRemainder should make a copy of the data ([58ee959](https://www.github.com/cheminfo/mass-tools/commit/58ee9597d7a44e62a00d7e44428bfb8035448757))
* mf-global exports groups and elements (and not Groups and Elements) ([8fc0281](https://www.github.com/cheminfo/mass-tools/commit/8fc02813da21ccfd9b66bd66633f821c6d160739))

### [1.1.1](https://www.github.com/cheminfo/mass-tools/compare/v1.1.0...v1.1.1) (2021-08-29)


### Bug Fixes

* add missing mf-parser descriiption ([c0faa0d](https://www.github.com/cheminfo/mass-tools/commit/c0faa0d33bb9ad69e1766a31eee2ce1fe7a2e13d))

## [1.1.0](https://www.github.com/cheminfo/mass-tools/compare/v1.0.2...v1.1.0) (2021-07-12)


### Features

* copy README to mass-tools npm package ([34c57f8](https://www.github.com/cheminfo/mass-tools/commit/34c57f8dbfce3929b6dbe79f6721112e0396eca9))

### [1.0.2](https://www.github.com/cheminfo/mass-tools/compare/v1.0.1...v1.0.2) (2021-07-05)


### Bug Fixes

* isContinuous method in the browser ([9220a31](https://www.github.com/cheminfo/mass-tools/commit/9220a319036af24140a2c83af5e433972c707c55))

### [1.0.1](https://www.github.com/cheminfo/mass-tools/compare/v1.0.0...v1.0.1) (2021-07-05)


### Bug Fixes

* ignore small peaks in isContinous ([183c5c5](https://www.github.com/cheminfo/mass-tools/commit/183c5c58a82cff828ab47b516dfbb6d7f88b198a))

## [1.0.0](https://www.github.com/cheminfo/mass-tools/compare/v0.63.0...v1.0.0) (2021-06-16)


### Features

* **isotopic-distribution:** add options sumValue in getXY ([fd883f2](https://www.github.com/cheminfo/mass-tools/commit/fd883f2d3d8d8a8bc7086bbe58c02ed8c749395e))


### Bug Fixes

* fix name of glycine derivatives ([45ca580](https://www.github.com/cheminfo/mass-tools/commit/45ca580d1258df091e7ab51877b9d0470d7ab6f9))

## [0.63.0](https://www.github.com/cheminfo/mass-tools/compare/v0.62.0...v0.63.0) (2021-06-09)


### Features

* add Phg, Hpg, Dpg abbreviation groups ([e8f7067](https://www.github.com/cheminfo/mass-tools/commit/e8f7067b7f226725e7b3c43eb0181b2268d64f5f))

## [0.62.0](https://www.github.com/cheminfo/mass-tools/compare/v0.61.2...v0.62.0) (2021-06-09)


### Features

* add MF.getElements ([f1822bf](https://www.github.com/cheminfo/mass-tools/commit/f1822bf491536b73c0bac709784f03fb5fb7357b))

### [0.61.2](https://www.github.com/cheminfo/mass-tools/compare/v0.61.1...v0.61.2) (2021-05-28)


### Bug Fixes

* valence of Si ([08f5d43](https://www.github.com/cheminfo/mass-tools/commit/08f5d43de22720a07a8474f350a877900ea93c37))

### [0.61.1](https://www.github.com/cheminfo/mass-tools/compare/v0.61.0...v0.61.1) (2021-04-28)


### Bug Fixes

* allow isolated peptides fragments even with links ([a3fbd2f](https://www.github.com/cheminfo/mass-tools/commit/a3fbd2f85c3fa72738e21124243e74fa41e837ee))

## [0.61.0](https://www.github.com/cheminfo/mass-tools/compare/v0.60.4...v0.61.0) (2021-04-20)


### Features

* allow to have anchors # in MF ([4c920ff](https://www.github.com/cheminfo/mass-tools/commit/4c920ffea6c4020471ef6d7c1df8985e48bb4395))
* **emdb:** fromPeptidicSequence allows many sequences separated by a comma ([8f2495f](https://www.github.com/cheminfo/mass-tools/commit/8f2495f384f3efb33e8e8611f5e61dfd805b1a2e))
* format MF containing anchors ([dc8d469](https://www.github.com/cheminfo/mass-tools/commit/dc8d46986144dead0d92e607160c1746ca9c3fb0))
* **generate-mf:** allows to filter by matching # ([d32388a](https://www.github.com/cheminfo/mass-tools/commit/d32388acd9135f4315ead101c25312de4628f35c))
* migrate peptide project to mass-tools ([4c94d3f](https://www.github.com/cheminfo/mass-tools/commit/4c94d3f13fbe79a1abd833243cb2a8b6a0bf9a90))


### Bug Fixes

* **mf-generator:** anchors were not working correctly ([c75da9c](https://www.github.com/cheminfo/mass-tools/commit/c75da9c5dc3d66d665f5fa98780173dd44c57ede))

### [0.60.4](https://www.github.com/cheminfo/mass-tools/compare/v0.60.3...v0.60.4) (2021-03-24)


### Bug Fixes

* **mf-from-ea:** Improve README ([88c32ed](https://www.github.com/cheminfo/mass-tools/commit/88c32ed82151288c377975e0977f3b63aa5deafe))
* package.json name ([4d6fbca](https://www.github.com/cheminfo/mass-tools/commit/4d6fbca999e04a0b288d99fa07d9d34d62551fc3))

### [0.60.3](https://www.github.com/cheminfo/mass-tools/compare/v0.60.2...v0.60.3) (2021-03-24)


### Bug Fixes

* **mf-from-ea:** update spelling mistake in README ([3de19c5](https://www.github.com/cheminfo/mass-tools/commit/3de19c542071df2a7975ba2e53b9e34f8dc42e22))

### [0.60.2](https://www.github.com/cheminfo/mass-tools/compare/v0.60.1...v0.60.2) (2021-03-16)


### Bug Fixes

* wrong links in some packages.json ([3c5829a](https://www.github.com/cheminfo/mass-tools/commit/3c5829a153dd198d56e7d54c065bf7e241ea0423))

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
