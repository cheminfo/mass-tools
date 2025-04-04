# Changelog

## [7.49.0](https://github.com/cheminfo/mass-tools/compare/v7.48.3...v7.49.0) (2025-04-03)


### Features

* **ms-spectrum:** add options to Spectrum.maxY ([#280](https://github.com/cheminfo/mass-tools/issues/280)) ([6a4f3fa](https://github.com/cheminfo/mass-tools/commit/6a4f3faf091b062384559ca95952a01e3d25fae6))

## [7.48.3](https://github.com/cheminfo/mass-tools/compare/v7.48.2...v7.48.3) (2025-03-22)


### Bug Fixes

* **mf-parser:** getNumberOfIsotopologues always returns a number. 0 if no stable isotopoe of no MF ([ece391a](https://github.com/cheminfo/mass-tools/commit/ece391ab98a75eec89c42e9ca06cfb4309d15760))
* **mf-parser:** mf.getInfo always returns the nbIsotopologues property ([032b1da](https://github.com/cheminfo/mass-tools/commit/032b1da800ac360aa0e422b19de1702d7553687b))
* **mf-parser:** rename types PartInfo -&gt; MFInfo, PartInfoWithParts -> MFInfoWithParts ([3388b75](https://github.com/cheminfo/mass-tools/commit/3388b7561527ea41f7ffa93c297964dce292b746))
* **mf-parser:** toParts({expand:false}) does not have side effects anymore ([dec8cf9](https://github.com/cheminfo/mass-tools/commit/dec8cf910fffa5b224cef00b5e2d710a461d546f))

## [7.48.2](https://github.com/cheminfo/mass-tools/compare/v7.48.1...v7.48.2) (2025-03-21)


### Bug Fixes

* **ms-report:** correct shim for browser after TS migration ([#276](https://github.com/cheminfo/mass-tools/issues/276)) ([62507b3](https://github.com/cheminfo/mass-tools/commit/62507b33fa1f948a033ad4143aff60eb47df8fbb))

## [7.48.1](https://github.com/cheminfo/mass-tools/compare/v7.48.0...v7.48.1) (2025-03-21)


### Bug Fixes

* **isotopic-distribution:** avoid approximation issues with getPeaks ([4230c58](https://github.com/cheminfo/mass-tools/commit/4230c582befb77ce66616b496a705abe4e716fa6))
* **octochemdb:** update orama to solve build issue ([#275](https://github.com/cheminfo/mass-tools/issues/275)) ([4674fd1](https://github.com/cheminfo/mass-tools/commit/4674fd1515cc71a45731d04d4117fcd34298b802))

## [7.48.0](https://github.com/cheminfo/mass-tools/compare/v7.47.1...v7.48.0) (2025-03-20)


### Features

* **mf-parser:** add info about number of isotopologues ([#270](https://github.com/cheminfo/mass-tools/issues/270)) ([ba80823](https://github.com/cheminfo/mass-tools/commit/ba808235a6b9e471e4650c9028cc75eb9628f76e))

## [7.47.1](https://github.com/cheminfo/mass-tools/compare/v7.47.0...v7.47.1) (2025-03-17)


### Bug Fixes

* **isotopic-distribution:** do not round limits in getGaussian ([#264](https://github.com/cheminfo/mass-tools/issues/264)) ([a2a9995](https://github.com/cheminfo/mass-tools/commit/a2a9995a01c4af16944168a1cec9c6ddbf76c22e))

## [7.47.0](https://github.com/cheminfo/mass-tools/compare/v7.46.0...v7.47.0) (2025-03-12)


### Features

* **mf-parser:** remove useless surrounding parenthesis and 1 multiplier when displaying a MF ([#262](https://github.com/cheminfo/mass-tools/issues/262)) ([a9b9947](https://github.com/cheminfo/mass-tools/commit/a9b99479c4d145b228a5b2f721a0d77d41f48bef))

## [7.46.0](https://github.com/cheminfo/mass-tools/compare/v7.45.0...v7.46.0) (2025-03-10)


### Features

* **ms-spectrum:** export `fromMonoisotopicMass` ([#260](https://github.com/cheminfo/mass-tools/issues/260)) ([dd8d2a4](https://github.com/cheminfo/mass-tools/commit/dd8d2a46a25b552003fa5e771b6190fd36794c27))


### Bug Fixes

* **mf-parser:** toDisplay deals correctly with simple charges ([#261](https://github.com/cheminfo/mass-tools/issues/261)) ([42d2b7a](https://github.com/cheminfo/mass-tools/commit/42d2b7a6d0f6778fc0b01cd4c17bd3e8e475452b))
* **mf-utilities:** types returned by preprocessIonizations ([#258](https://github.com/cheminfo/mass-tools/issues/258)) ([629973d](https://github.com/cheminfo/mass-tools/commit/629973d8175d3d3b0c75d1a488cfc83261c578f4))
* only expose build code in packages ([#255](https://github.com/cheminfo/mass-tools/issues/255)) ([f295376](https://github.com/cheminfo/mass-tools/commit/f2953761ba2e44ebee1d01dbbcf88e3896b2a644))

## [7.45.0](https://github.com/cheminfo/mass-tools/compare/v7.44.4...v7.45.0) (2024-12-18)


### Features

* **mf-parser:** allow decimal isotopic composition ([#253](https://github.com/cheminfo/mass-tools/issues/253)) ([9696c50](https://github.com/cheminfo/mass-tools/commit/9696c50b180913bfbf3d193ff7cda56e4e3d9bd6))

## [7.44.4](https://github.com/cheminfo/mass-tools/compare/v7.44.3...v7.44.4) (2024-12-17)


### Bug Fixes

* **mf-parser:** package.json exposes only main ([#247](https://github.com/cheminfo/mass-tools/issues/247)) ([7a77ffc](https://github.com/cheminfo/mass-tools/commit/7a77ffc4620c74ccacd0bf0d3cf6fda825017d35))

## [7.44.3](https://github.com/cheminfo/mass-tools/compare/v7.44.2...v7.44.3) (2024-12-17)


### Bug Fixes

* **isotopic-distribution:** maxValue was not correctly managed in getGaussian ([#245](https://github.com/cheminfo/mass-tools/issues/245)) ([3b8aaf2](https://github.com/cheminfo/mass-tools/commit/3b8aaf278e47512c61b8565eed76c574be7d9362))

## [7.44.2](https://github.com/cheminfo/mass-tools/compare/v7.44.1...v7.44.2) (2024-12-09)


### Bug Fixes

* **mf-parser:** provide getInfo advanced typings ([#241](https://github.com/cheminfo/mass-tools/issues/241)) ([06a4121](https://github.com/cheminfo/mass-tools/commit/06a41211a12b98f35f47fbbca9442c9bae55ed8a))

## [7.44.1](https://github.com/cheminfo/mass-tools/compare/v7.44.0...v7.44.1) (2024-12-09)


### Bug Fixes

* **isotopic-distribution:** crash with getGaussian and maxValue when no peaks ([#239](https://github.com/cheminfo/mass-tools/issues/239)) ([80906a9](https://github.com/cheminfo/mass-tools/commit/80906a9de20a34d1fd3a9faf71b190299621ab26))

## [7.44.0](https://github.com/cheminfo/mass-tools/compare/v7.43.0...v7.44.0) (2024-12-05)


### Features

* **chemical-elements:** rewrite in TypeScript ([f663e61](https://github.com/cheminfo/mass-tools/commit/f663e61c0b8c6d27360d95b182204cf64cbf70cb))


### Bug Fixes

* declare missing dependencies ([29ee58c](https://github.com/cheminfo/mass-tools/commit/29ee58cee2e5fd5412d6477a71d56b1d8174dc90))
* update dependencies and add source mapping ([01767cf](https://github.com/cheminfo/mass-tools/commit/01767cfc06c047cd07d687fe4ccdad492952360b))

## [7.43.0](https://github.com/cheminfo/mass-tools/compare/v7.42.1...v7.43.0) (2024-11-27)


### Features

* **ms-spectrum:** getBestPeaks have now min and maxValue ([#224](https://github.com/cheminfo/mass-tools/issues/224)) ([8a3ae33](https://github.com/cheminfo/mass-tools/commit/8a3ae3322d53a911fe1473c8c8eb192f86613627))
* **peptide:** allow conversion of lowercase AA sequences ([#223](https://github.com/cheminfo/mass-tools/issues/223)) ([f547db4](https://github.com/cheminfo/mass-tools/commit/f547db4bb9fe3c877524dc64fad97d3d1140758c))

## [7.42.1](https://github.com/cheminfo/mass-tools/compare/v7.42.0...v7.42.1) (2024-11-19)


### Bug Fixes

* **mf-utilities:** preprocessRanges was not dealing correctly with parenthesis ([#220](https://github.com/cheminfo/mass-tools/issues/220)) ([54b6845](https://github.com/cheminfo/mass-tools/commit/54b6845d1b7fbbc8db0dfbdabdc8c18d057e4aa1))

## [7.42.0](https://github.com/cheminfo/mass-tools/compare/v7.41.3...v7.42.0) (2024-11-13)


### Features

* **isotopic-distribution:** allow to select number of decimals during export ([#218](https://github.com/cheminfo/mass-tools/issues/218)) ([a927b8a](https://github.com/cheminfo/mass-tools/commit/a927b8a236a7bb18a72cbbc53064d9fd550adf0a))

## [7.41.3](https://github.com/cheminfo/mass-tools/compare/v7.41.2...v7.41.3) (2024-10-14)


### Bug Fixes

* **ms-spectrum:** remove duplicate param type ([#215](https://github.com/cheminfo/mass-tools/issues/215)) ([63e2a08](https://github.com/cheminfo/mass-tools/commit/63e2a085925b78669b337d57d91dd8e1d4fc8bb3))

## [7.41.2](https://github.com/cheminfo/mass-tools/compare/v7.41.1...v7.41.2) (2024-10-01)


### Bug Fixes

* generateMFs with charges was giving wrong results ([#213](https://github.com/cheminfo/mass-tools/issues/213)) ([e6d5ac1](https://github.com/cheminfo/mass-tools/commit/e6d5ac1be3ce31e1aa9e20b42984fd9da48d2669))

## [7.41.1](https://github.com/cheminfo/mass-tools/compare/v7.41.0...v7.41.1) (2024-08-06)


### Bug Fixes

* need to build-lerna before build for browser because some code in in TS ([#210](https://github.com/cheminfo/mass-tools/issues/210)) ([3ee2466](https://github.com/cheminfo/mass-tools/commit/3ee246647c309e1dd526161ef9c253557e89ca3e))

## [7.41.0](https://github.com/cheminfo/mass-tools/compare/v7.40.2...v7.41.0) (2024-08-02)


### Features

* add deltaNeutrons in isotopicDistribution when calculating the isotopic distribution ([#208](https://github.com/cheminfo/mass-tools/issues/208)) ([a543d38](https://github.com/cheminfo/mass-tools/commit/a543d38e5b4afc5ed0d59968f701fb926818f897))

## [7.40.2](https://github.com/cheminfo/mass-tools/compare/v7.40.1...v7.40.2) (2024-07-31)


### Bug Fixes

* **peptide:** allow convertion of peptide sequences if only one letter ([69338f2](https://github.com/cheminfo/mass-tools/commit/69338f259474cb9f40a54181801a9172f7e4b915))

## [7.40.1](https://github.com/cheminfo/mass-tools/compare/v7.40.0...v7.40.1) (2024-07-11)


### Bug Fixes

* **isotopic-distribution:** deal correctly with isotopologues in case of non natural isotopic distribution ([74684ba](https://github.com/cheminfo/mass-tools/commit/74684ba33cd61023bec0ce13eec88873e2458893))
* **mf-parser:** getIsotopesInfo set correctly in the atom property the atom and not the isotope or enriched isotope ([43f1046](https://github.com/cheminfo/mass-tools/commit/43f1046b17274f8d739df6230f57eee038610ced))

## [7.40.0](https://github.com/cheminfo/mass-tools/compare/v7.39.1...v7.40.0) (2024-07-08)


### Features

* **mass-tools:** expose function preprocessIonizations ([a2cabe8](https://github.com/cheminfo/mass-tools/commit/a2cabe84132429bf61567660997c7e1dceb463da))


### Bug Fixes

* enable unicorn ESLint plugin and fix errors ([9303048](https://github.com/cheminfo/mass-tools/commit/93030488bbbd5879dc4639a5d0c81c7664a927b8))
* improve types in isotopic-distribution and mf-parser ([#202](https://github.com/cheminfo/mass-tools/issues/202)) ([e5769cd](https://github.com/cheminfo/mass-tools/commit/e5769cd588adb69974abfa60f411bc2dc1887fa6))

## [7.39.1](https://github.com/cheminfo/mass-tools/compare/v7.39.0...v7.39.1) (2024-06-29)


### Bug Fixes

* remove dependency on ml-distance ([#198](https://github.com/cheminfo/mass-tools/issues/198)) ([2009cae](https://github.com/cheminfo/mass-tools/commit/2009caeeca901278a8bb9d4bfd9e3740a8147ad1))

## [7.39.0](https://github.com/cheminfo/mass-tools/compare/v7.38.0...v7.39.0) (2024-06-26)


### Features

* generate TS typings from jsdoc ([#196](https://github.com/cheminfo/mass-tools/issues/196)) ([c6ca610](https://github.com/cheminfo/mass-tools/commit/c6ca610976e04d851420f8b65d8220d39f64a83b))


### Bug Fixes

* update dependencies ([#194](https://github.com/cheminfo/mass-tools/issues/194)) ([70b3dab](https://github.com/cheminfo/mass-tools/commit/70b3dab62fefbec18b05dee6fc1694f72665c390))

## [7.38.0](https://github.com/cheminfo/mass-tools/compare/v7.37.0...v7.38.0) (2024-06-05)


### Features

* MassTools expostes mfFromAtomicRatio ([ab787f1](https://github.com/cheminfo/mass-tools/commit/ab787f196efd6e662dc5cd29d496e5b63ffda301))

## [7.37.0](https://github.com/cheminfo/mass-tools/compare/v7.36.1...v7.37.0) (2024-06-05)


### Features

* **mf-from-atomic-ratio:** New package to find f from atomic ratio. Use in XPS for example. ([06c1b3e](https://github.com/cheminfo/mass-tools/commit/06c1b3eb0f6a374af626c837b77f421a3ae98a7c))

## [7.36.1](https://github.com/cheminfo/mass-tools/compare/v7.36.0...v7.36.1) (2024-05-17)


### Bug Fixes

* **emdb:** update dependencies ([b4d0e44](https://github.com/cheminfo/mass-tools/commit/b4d0e44ce75d42f7bd5e29abb6d225471230202d))
* **ms-spectrum:** update dependencies in ms-spectrum ([3aa0f80](https://github.com/cheminfo/mass-tools/commit/3aa0f807008c7094e4de499133595412025d3cca))

## [7.36.0](https://github.com/cheminfo/mass-tools/compare/v7.35.0...v7.36.0) (2024-05-10)


### Features

* **ms-spectrum:** Charge is not calcluated on peaks anymore ([30e045a](https://github.com/cheminfo/mass-tools/commit/30e045a20e666003150e29d22a0dcd1fa0946e6e))


### Bug Fixes

* remove __tests__ from build ([7a6587e](https://github.com/cheminfo/mass-tools/commit/7a6587e2024a4c15763d751ccbdaa65baa5351e2))

## [7.35.0](https://github.com/cheminfo/mass-tools/compare/v7.34.0...v7.35.0) (2024-04-16)


### Features

* **ms-spectrum:** Charge is not calcluated on peaks anymore ([#184](https://github.com/cheminfo/mass-tools/issues/184)) ([2052187](https://github.com/cheminfo/mass-tools/commit/2052187f723c9370a18a95bfbd3ab067574aa8f4))

## [7.34.0](https://github.com/cheminfo/mass-tools/compare/v7.33.5...v7.34.0) (2024-04-03)


### Features

* **mf-matcher:** Add filter by minMW and maxMW for msemMatcher ([c46e3b9](https://github.com/cheminfo/mass-tools/commit/c46e3b9ff427160c59b82e8b37f01c1b1f8e3923))

## [7.33.5](https://github.com/cheminfo/mass-tools/compare/v7.33.4...v7.33.5) (2024-03-16)


### Bug Fixes

* update dependencies ([#180](https://github.com/cheminfo/mass-tools/issues/180)) ([f4bea76](https://github.com/cheminfo/mass-tools/commit/f4bea76790bbe4d0f25d71a64cbd7578aef5013a))

## [7.33.4](https://github.com/cheminfo/mass-tools/compare/v7.33.3...v7.33.4) (2024-03-07)


### Bug Fixes

* remove duplicates of ml-spectra-processing ([040da0e](https://github.com/cheminfo/mass-tools/commit/040da0e20eb416be3f308c8a1667627672a89944))

## [7.33.3](https://github.com/cheminfo/mass-tools/compare/v7.33.2...v7.33.3) (2024-03-07)


### Bug Fixes

* update ml-spectra-processing ([4df865d](https://github.com/cheminfo/mass-tools/commit/4df865dd147c8199f5de3aa74779905445c132b5))

## [7.33.2](https://github.com/cheminfo/mass-tools/compare/v7.33.1...v7.33.2) (2024-02-22)


### Bug Fixes

* **octochemdb:** Cannot read property 'length' of undefined ([f34993d](https://github.com/cheminfo/mass-tools/commit/f34993d6127ac9bc2ab239d4e30d38e3300d8dae))

## [7.33.1](https://github.com/cheminfo/mass-tools/compare/v7.33.0...v7.33.1) (2024-02-15)


### Bug Fixes

* **octochemdb:** fix sorting if not data ([3ee9fdd](https://github.com/cheminfo/mass-tools/commit/3ee9fddddfe8b994dcad2979f4c5269761456e8d))

## [7.33.0](https://github.com/cheminfo/mass-tools/compare/v7.32.0...v7.33.0) (2024-01-30)


### Features

* **octochemdb:** search activesOrNaturals with noStereoTautomerID ([52ade5b](https://github.com/cheminfo/mass-tools/commit/52ade5b0333cfc6ee157d3f9d7f8fa62009818b4))

## [7.32.0](https://github.com/cheminfo/mass-tools/compare/v7.31.1...v7.32.0) (2024-01-23)


### Features

* allow to select technique in InSilicoSpectra search ([964afbf](https://github.com/cheminfo/mass-tools/commit/964afbfabee005a8f354332bb020dc7f1d9baa72))

## [7.31.1](https://github.com/cheminfo/mass-tools/compare/v7.31.0...v7.31.1) (2024-01-23)


### Bug Fixes

* **mass-fragmentation:** array variables need to be plural (modes, ionizations) ([672b9b0](https://github.com/cheminfo/mass-tools/commit/672b9b0d6f0ccd02aef305686e5209f371495dc8))

## [7.31.0](https://github.com/cheminfo/mass-tools/compare/v7.30.1...v7.31.0) (2023-12-13)


### Features

* **mass-fragmentation:** use ionization and mode to get reactions ([ca00605](https://github.com/cheminfo/mass-tools/commit/ca006053b9eca930cf1b6fab61c3e482821595ca))

## [7.30.1](https://github.com/cheminfo/mass-tools/compare/v7.30.0...v7.30.1) (2023-12-12)


### Bug Fixes

* **octochemdb:** sort in silice spectra search by similarity ([328e707](https://github.com/cheminfo/mass-tools/commit/328e70721c718bbb41898d1c16a11844576d20c7))

## [7.30.0](https://github.com/cheminfo/mass-tools/compare/v7.29.0...v7.30.0) (2023-12-12)


### Features

* **ms-spectrum:** MSComparator returns a similarity object ([acdfff5](https://github.com/cheminfo/mass-tools/commit/acdfff5d2203bd3c459c05075ba5c39dadf602d5))

## [7.29.0](https://github.com/cheminfo/mass-tools/compare/v7.28.0...v7.29.0) (2023-12-06)


### Features

* if relative mass display possible MF for selected peak ([153a591](https://github.com/cheminfo/mass-tools/commit/153a5913a661c9e516ab53a072940aaa0d970ee6))

## [7.28.0](https://github.com/cheminfo/mass-tools/compare/v7.27.0...v7.28.0) (2023-12-05)


### Features

* **mass-fragmentation:** improve reactions ([876932b](https://github.com/cheminfo/mass-tools/commit/876932b8bf039f1bd0776a23fb75b2d265e03a54))
* **octochemdb:** add searchInsilicoSpectra by masses and mf ([9f5e637](https://github.com/cheminfo/mass-tools/commit/9f5e637fb8ff955810c7a3d8964115c899940a34))


### Bug Fixes

* rename url to route ([d894dc5](https://github.com/cheminfo/mass-tools/commit/d894dc545f4cdce6b0cbd77c1e2c2c68afc580d1))

## [7.27.0](https://github.com/cheminfo/mass-tools/compare/v7.26.0...v7.27.0) (2023-12-04)


### Features

* **ms-spectrum:** Add new method getSimilarityByMasses ([9409ffb](https://github.com/cheminfo/mass-tools/commit/9409ffb477a52c64713f6b5dcc6138be387760fa))
* **octochemdb:** add searchInSilicoSpectra ([cef6df1](https://github.com/cheminfo/mass-tools/commit/cef6df1c89dda7f0c4d2cd73617980e8d5a313f6))

## [7.26.0](https://github.com/cheminfo/mass-tools/compare/v7.25.0...v7.26.0) (2023-11-28)


### Features

* background color in svg is related to peak intensity ([340e520](https://github.com/cheminfo/mass-tools/commit/340e5203567a83eb19c4ecdded3a2862b96c5044))
* **mass-fragmentation:** improve db fragmentation reactions ([1e3eaac](https://github.com/cheminfo/mass-tools/commit/1e3eaac4f68c3597de4257087ac67402618a6a21))

## [7.25.0](https://github.com/cheminfo/mass-tools/compare/v7.24.0...v7.25.0) (2023-11-21)


### Features

* **mass-fragmentation:** fragmentation without molfile ([30fc7b9](https://github.com/cheminfo/mass-tools/commit/30fc7b9a17d46ca1864c76f60f058278ff8f55cc))

## [7.24.0](https://github.com/cheminfo/mass-tools/compare/v7.23.0...v7.24.0) (2023-11-15)


### Features

* **mass-fragmentation:** improve reactions db ([93ec153](https://github.com/cheminfo/mass-tools/commit/93ec15300e3c88af07044b3412f1a1d1506896f9))

## [7.23.0](https://github.com/cheminfo/mass-tools/compare/v7.22.0...v7.23.0) (2023-11-13)


### Features

* **mass-fragmentation:** improve reactions DB ([09ce8db](https://github.com/cheminfo/mass-tools/commit/09ce8dbba25836bdacb2afeaaa8ef45543f75c71))

## [7.22.0](https://github.com/cheminfo/mass-tools/compare/v7.21.0...v7.22.0) (2023-11-01)


### Features

* **emdb:** searchSimilarity add a factor that to match the experimental spectrum ([183be3c](https://github.com/cheminfo/mass-tools/commit/183be3c1f0c954bb599cbaad5a8f4ebcdfb9e406))

## [7.21.0](https://github.com/cheminfo/mass-tools/compare/v7.20.1...v7.21.0) (2023-10-31)


### Features

* **isotopic-distribution:** allow to have an auto zone for search similarity ([d776120](https://github.com/cheminfo/mass-tools/commit/d77612004a90807263e2078573136dc0fea675d0))
* **isotopic-distribution:** allow to specify a threshold to filter the peaks by height ([b24f392](https://github.com/cheminfo/mass-tools/commit/b24f392b25597d7d2892a7aa9ede3dfc3dfba6dc))
* **ms-spectrum:** allow to specify threshold for peak picking ([d398012](https://github.com/cheminfo/mass-tools/commit/d398012df99d9c4d924572a5d819f519db5baf2c))


### Bug Fixes

* **emdb:** search similarity was not taking into account fwhm ([8475459](https://github.com/cheminfo/mass-tools/commit/84754591161d273451c36058ee6baef5e19f1633))
* **isotopic-disribution:** calculation of minY and maxY were inverted ([38a1a9f](https://github.com/cheminfo/mass-tools/commit/38a1a9f583eafb7dbf792b02fb01e2976b68fd20))

## [7.20.1](https://github.com/cheminfo/mass-tools/compare/v7.20.0...v7.20.1) (2023-10-19)


### Bug Fixes

* update dependencies and force old version of ml-matrix and ml-fcnnls ([aaffb31](https://github.com/cheminfo/mass-tools/commit/aaffb31aea9db1855ac5f1587456b411e8c85ba3))

## [7.20.0](https://github.com/cheminfo/mass-tools/compare/v7.19.1...v7.20.0) (2023-10-19)


### Features

* **mf-parser:** add 'flatten' to mf object to expand all the ranges ([1c461ea](https://github.com/cheminfo/mass-tools/commit/1c461ead14cb7054d26fcc7d7d84f69d955240c8))
* **mf-parser:** add flatten method on MF (and remove processRange) ([4e3c799](https://github.com/cheminfo/mass-tools/commit/4e3c79964c05f0fba33975069a1b442f4514976f))
* **mf-utilities:** processRange do not optimize if there is no ranges ([79a8e88](https://github.com/cheminfo/mass-tools/commit/79a8e884cc12a8f086031e78f63f40df7944767f))
* **mf-utilities:** processRange has an option to optimize in case only unique MF is important ([ab235a0](https://github.com/cheminfo/mass-tools/commit/ab235a00075ff45fdf176f83a4a34b10056d7e62))
* **mfs-deconvolution:** allow customMFs ([613e4a0](https://github.com/cheminfo/mass-tools/commit/613e4a0f54d9884646987e15c0d70a0a3689b1f0))

## [7.19.1](https://github.com/cheminfo/mass-tools/compare/v7.19.0...v7.19.1) (2023-10-16)


### Bug Fixes

* **mfs-deconvolution:** buildCombined was buggy because mfs were reordered ([8f148f6](https://github.com/cheminfo/mass-tools/commit/8f148f62dd837caa45537b9d74422b3a3a1adfcd))

## [7.19.0](https://github.com/cheminfo/mass-tools/compare/v7.18.0...v7.19.0) (2023-10-16)


### Features

* **mfs-deconvolution:** improve speed ([e1ac88e](https://github.com/cheminfo/mass-tools/commit/e1ac88eb69ab6549956d3ba613c0e333ff720e30))

## [7.18.0](https://github.com/cheminfo/mass-tools/compare/v7.17.0...v7.18.0) (2023-10-13)


### Features

* **mfs-deconvolution:** return a function that allows to calculate filteredReconstructed ([bfe5bd5](https://github.com/cheminfo/mass-tools/commit/bfe5bd5df0d4b6dc4782f08957f35589e5ec8090))

## [7.17.0](https://github.com/cheminfo/mass-tools/compare/v7.16.0...v7.17.0) (2023-10-11)


### Features

* **mass-fragmentation:** add molecules with same mass ([e3cd1b7](https://github.com/cheminfo/mass-tools/commit/e3cd1b70ac4989b71fb7e0934853ba5c7b1cef91))
* **mass-fragmentation:** rename getMasses to groupByMZ ([642c96e](https://github.com/cheminfo/mass-tools/commit/642c96e07ebe543df076e6d4d6ff9b2a0f253141))

## [7.16.0](https://github.com/cheminfo/mass-tools/compare/v7.15.0...v7.16.0) (2023-10-10)


### Features

* **mass-fragmentation:** improve getDatabase filter options ([#150](https://github.com/cheminfo/mass-tools/issues/150)) ([2a8c5b8](https://github.com/cheminfo/mass-tools/commit/2a8c5b83ea752524f98a0f77241f172747f0e66c))

## [7.15.0](https://github.com/cheminfo/mass-tools/compare/v7.14.0...v7.15.0) (2023-10-10)


### Features

* **octochemdb:** massSpectra queries returns the database ([ace015d](https://github.com/cheminfo/mass-tools/commit/ace015dc660d14118996ceb3e5fd537e29b9b22f))

## [7.14.0](https://github.com/cheminfo/mass-tools/compare/v7.13.1...v7.14.0) (2023-10-10)


### Features

* **mass-fragmentation:** select ionization kind ([abb429b](https://github.com/cheminfo/mass-tools/commit/abb429b9f548f70ba699beff2e2f596433c254ce))
* **mass-fragmentation:** update openchemlib-utils ([10737d8](https://github.com/cheminfo/mass-tools/commit/10737d8b8f44995b640a3a07b2fe09b1e0ab495b))


### Bug Fixes

* **mass-fragmentation:** typos in getLabel function ([#147](https://github.com/cheminfo/mass-tools/issues/147)) ([7bc8dd2](https://github.com/cheminfo/mass-tools/commit/7bc8dd23ee9e77376bab41a8d32458c79f7daecb))

## [7.13.1](https://github.com/cheminfo/mass-tools/compare/v7.13.0...v7.13.1) (2023-10-06)


### Bug Fixes

* **mass-fragmentation:** load correctly the datatabase of fragmentations ([#145](https://github.com/cheminfo/mass-tools/issues/145)) ([0bde65d](https://github.com/cheminfo/mass-tools/commit/0bde65d0a76323bc2a761ce766877d1d533c0c93))

## [7.13.0](https://github.com/cheminfo/mass-tools/compare/v7.12.0...v7.13.0) (2023-10-05)


### Features

* allow to findMFs with negative atoms ([d4fa5c5](https://github.com/cheminfo/mass-tools/commit/d4fa5c5a45e8bf7b5ca1e8649508a9ba8ddc135b))

## [7.12.0](https://github.com/cheminfo/mass-tools/compare/v7.11.3...v7.12.0) (2023-09-28)


### Features

* add kwTitles in activesOrNaturals ([9fdb6be](https://github.com/cheminfo/mass-tools/commit/9fdb6be47cdaa9eb0717c8fa923804697fac8248))
* **octochemdb:** Generalise mass spectra search  ([#142](https://github.com/cheminfo/mass-tools/issues/142)) ([de90b45](https://github.com/cheminfo/mass-tools/commit/de90b45a97f64ab9af8a2de4ce2a81b6f0c4db62))


### Bug Fixes

* **mfs-deconvolution:** difference was not correctly calculated ([2f7d37b](https://github.com/cheminfo/mass-tools/commit/2f7d37b0d7f5e28d7ec35143567ec714dfb8666c))

## [7.11.3](https://github.com/cheminfo/mass-tools/compare/v7.11.2...v7.11.3) (2023-09-04)


### Bug Fixes

* **emdb:** correct documentation ([3df769b](https://github.com/cheminfo/mass-tools/commit/3df769bd954c61e25b776c2ba0f38dc9117ec94e))
* **mass-fragmentation:** correct documentation ([539f924](https://github.com/cheminfo/mass-tools/commit/539f924b35d29bb8c4af44863b0df986867917a8))

## [7.11.2](https://github.com/cheminfo/mass-tools/compare/v7.11.1...v7.11.2) (2023-09-04)


### Bug Fixes

* fetchJSON use local test files ([55f222e](https://github.com/cheminfo/mass-tools/commit/55f222e9e412d043b4d124adaed3fc07c6e7f9cd))
* **octochemdb:** .only in tests ([a089f13](https://github.com/cheminfo/mass-tools/commit/a089f13c0818cd1dfe6632c154fd8d0db04dfd0a))
* **octochemdb:** fetch local files for activesOrNaturals ([39d3a89](https://github.com/cheminfo/mass-tools/commit/39d3a891df2cd622b52e41339682b37d8c41516c))
* **octochemdb:** missing package msw for tests ([00cf005](https://github.com/cheminfo/mass-tools/commit/00cf00593a5a933b70fdd01907a6ea62691d204d))
* **octochemdb:** retry if fetch fail ([8489705](https://github.com/cheminfo/mass-tools/commit/8489705bad049383dd7fa22fe79cdb4f99edb709))
* use limit in tests to avoid timeout ([b2c102e](https://github.com/cheminfo/mass-tools/commit/b2c102e0b5f25963e7071d4f38ece8f622f60787))

## [7.11.1](https://github.com/cheminfo/mass-tools/compare/v7.11.0...v7.11.1) (2023-08-25)


### Bug Fixes

* **mass-fragmentation:** ts-ignore for ionizationFragments ([bef8b48](https://github.com/cheminfo/mass-tools/commit/bef8b48c6b1f6bb2a9aa14e43f2be806befef4bf))
* update all dependencies ([c1aee41](https://github.com/cheminfo/mass-tools/commit/c1aee417d98ee83caf88489dc60db7ee449c744e))

## [7.11.0](https://github.com/cheminfo/mass-tools/compare/v7.10.0...v7.11.0) (2023-08-25)


### Features

* **mass-fragmentation:** limit reactions ([ad5c902](https://github.com/cheminfo/mass-tools/commit/ad5c902d986cebc187817c6a85a5b94d35dc320d))


### Bug Fixes

* **mass-fragmentation:** generate all combinations of ionization ([efcc9dd](https://github.com/cheminfo/mass-tools/commit/efcc9ddb2b1d4bbab5427e43da8b3d9e0723214d))

## [7.10.0](https://github.com/cheminfo/mass-tools/compare/v7.9.1...v7.10.0) (2023-08-18)


### Features

* custom ionization db for fragmentation ([4672fe4](https://github.com/cheminfo/mass-tools/commit/4672fe4b2bf77e35882ff42a7db3be96c3bdec43))
* **mass-fragmentation:** export getDatabase ([37873c2](https://github.com/cheminfo/mass-tools/commit/37873c2a1a91d8ae5fe186dc01938ec89ba784ad))
* **mass-tools:** give access to MassFragmentation in lactame ([b9e9879](https://github.com/cheminfo/mass-tools/commit/b9e9879e5fc77e7d4cbda3c105d2b38d0361fcb6))
* **mfs-deconvolution:** add difference and matchingScore ([c00901a](https://github.com/cheminfo/mass-tools/commit/c00901a4dc17d39bc116cd9f980a7058aa2abdcf))
* **ms-spectrum:** allow to define threshold for peakPicking when creating spectrum ([bbf0365](https://github.com/cheminfo/mass-tools/commit/bbf0365c368d935649026d717af9cfb0c2000df3))

## [7.9.1](https://github.com/cheminfo/mass-tools/compare/v7.9.0...v7.9.1) (2023-07-18)


### Bug Fixes

* update dependencies ([2beb667](https://github.com/cheminfo/mass-tools/commit/2beb667c10cea4cc85b1da02150390421ae739fc))

## [7.9.0](https://github.com/cheminfo/mass-tools/compare/v7.8.2...v7.9.0) (2023-07-18)


### Features

* reactionFragmentation ([#130](https://github.com/cheminfo/mass-tools/issues/130)) ([bd7aaad](https://github.com/cheminfo/mass-tools/commit/bd7aaadde5d2442f2caf1c69ff1d693d8e9f1840))

## [7.8.2](https://github.com/cheminfo/mass-tools/compare/v7.8.1...v7.8.2) (2023-07-17)


### Bug Fixes

* **octochemdb:** taxonomy search ([bf4eee0](https://github.com/cheminfo/mass-tools/commit/bf4eee09a50b414d32756034f79b6e900ef3921d))

## [7.8.1](https://github.com/cheminfo/mass-tools/compare/v7.8.0...v7.8.1) (2023-07-11)


### Bug Fixes

* searchTaxonomies filter instead of find ([f3b01fe](https://github.com/cheminfo/mass-tools/commit/f3b01fe66628719541b003fdc4d5af28ed140e4d))

## [7.8.0](https://github.com/cheminfo/mass-tools/compare/v7.7.0...v7.8.0) (2023-07-11)


### Features

* apply ionization to fixed level [#126](https://github.com/cheminfo/mass-tools/issues/126) ([028d53e](https://github.com/cheminfo/mass-tools/commit/028d53eb8ac432e160471f08f8b2c3fba4f80495))
* full fragmentation of mdma ([ec526fb](https://github.com/cheminfo/mass-tools/commit/ec526fb241cf56eccde4f50cd1c1681c71a8dd06))
* get count of lowest children ([4f7b02a](https://github.com/cheminfo/mass-tools/commit/4f7b02a8f8179725edc92423373571372c6e9a7f))


### Bug Fixes

* add new field titles ([cadee5d](https://github.com/cheminfo/mass-tools/commit/cadee5d7cc691e9edd80d1bb5a03832484f0a28e))
* get observed monoisotopic mass [#123](https://github.com/cheminfo/mass-tools/issues/123) ([592ff9a](https://github.com/cheminfo/mass-tools/commit/592ff9a1b3b7c501415ea85169fb6e343ac054cc))
* increased timeout ([ceffed3](https://github.com/cheminfo/mass-tools/commit/ceffed30fd2647533325fb5a3fb0fbd7a623e4fc))
* **octochemdb:** prevent double DB creating ([a925180](https://github.com/cheminfo/mass-tools/commit/a9251804deec2c0211ca8683378cd2be3a7a064e))
* removed useless imports ([18e42e9](https://github.com/cheminfo/mass-tools/commit/18e42e95d29309c579cf031d77ec078f26418a86))
* updated snapshot ([aafde06](https://github.com/cheminfo/mass-tools/commit/aafde06a8e52ab10094ae64b60448252b46245c4))

## [7.7.0](https://github.com/cheminfo/mass-tools/compare/v7.6.0...v7.7.0) (2023-06-20)


### Features

* **octochemdb:** add callback for in-memory search DB preparation ([a89d628](https://github.com/cheminfo/mass-tools/commit/a89d628e5539f5814b603044666b08d9ff68d894))
* **octochemdb:** taxonomyTree ([31a58e6](https://github.com/cheminfo/mass-tools/commit/31a58e66a84bc0460972f67a3a360324e5dce111))

## [7.6.0](https://github.com/cheminfo/mass-tools/compare/v7.5.0...v7.6.0) (2023-06-19)


### Features

* **octochemdb:** add compoundsFromMF and append title ([679103d](https://github.com/cheminfo/mass-tools/commit/679103d065f4abf8dbd324e1e5d4b7990d7da628))
* **octochemdb:** add excludedCollections ([1a5f907](https://github.com/cheminfo/mass-tools/commit/1a5f907e68d49d795bbf4617adb0922ab46369a2))
* **octochemdb:** add taxonomyComparator ([bf0aa42](https://github.com/cheminfo/mass-tools/commit/bf0aa42d94c78e46282343a74cb8c27abe556e96))
* **octochemdb:** compoundsFromMF sorts results by title length ([90778bc](https://github.com/cheminfo/mass-tools/commit/90778bc45001747cfddc945d6dead40ac6038365))
* taxonomyTree ([2cd05f1](https://github.com/cheminfo/mass-tools/commit/2cd05f1ac0c2b2923d3e277567599624f3b9a04e))


### Bug Fixes

* taxonomy type ([a9a01be](https://github.com/cheminfo/mass-tools/commit/a9a01be7a597b54902f1f4bef2e40c60fede1f68))
* test cases ([a0393fd](https://github.com/cheminfo/mass-tools/commit/a0393fdb94cffaf4ebc2cc944e9e4697470eb57e))

## [7.5.0](https://github.com/cheminfo/mass-tools/compare/v7.4.0...v7.5.0) (2023-06-13)


### Features

* **mfs-deconvolution:** improve speed if no overlap between theoretical and experimental ([ed6eb92](https://github.com/cheminfo/mass-tools/commit/ed6eb921e3c969a17930f40c59fe5e88d9228769))

## [7.4.0](https://github.com/cheminfo/mass-tools/compare/v7.3.0...v7.4.0) (2023-06-13)


### Features

* **mfs-deconvolution:** add method reconstruct ([c328711](https://github.com/cheminfo/mass-tools/commit/c328711e0ea719a6de9a955c0a45354fa0c20cea))

## [7.3.0](https://github.com/cheminfo/mass-tools/compare/v7.2.0...v7.3.0) (2023-06-12)


### Features

* **mass-tools:** expose mfsDeconvolution ([31e32c1](https://github.com/cheminfo/mass-tools/commit/31e32c1f4d193585cdc885b7fe19f34633d5391d))
* **mfs-deconvolution:** specify precision and sort result ([c1b985e](https://github.com/cheminfo/mass-tools/commit/c1b985e35bc563c3d89100b8f37c28a57731bf96))
* **octochemdb:** add pubmedCompounds method ([4ebadd2](https://github.com/cheminfo/mass-tools/commit/4ebadd236088fbe01caa06e53013a47708a07cee))
* search taxonomies ([347da02](https://github.com/cheminfo/mass-tools/commit/347da02a11940392563d29faad28a30682cc402e))
* working version of mfsDeconvolutionq ([e80c71c](https://github.com/cheminfo/mass-tools/commit/e80c71c72455b07623796362788757984c12087b))


### Bug Fixes

* **octochemdb:** correctly summarize taxonomies ([ca91403](https://github.com/cheminfo/mass-tools/commit/ca91403aa4479233cd3188a47854e218cd13141a))

## [7.2.0](https://github.com/cheminfo/mass-tools/compare/v7.1.0...v7.2.0) (2023-05-31)


### Features

* db schema based on queryField and sort patents by nbCompounds ([fa76d88](https://github.com/cheminfo/mass-tools/commit/fa76d882388a4fdc06d7ec33eabd8bd9d6edb88d))
* **ms-spectrum:** add spectrum info containing min / max values of the original spectrum ([3dbf517](https://github.com/cheminfo/mass-tools/commit/3dbf5175e1ef4f7689a5ff666fdabc2167691405))
* normalize activities ([0f2a99a](https://github.com/cheminfo/mass-tools/commit/0f2a99aaa250cca23943f9a6e4f35eead35b753e))
* **octochemdb:** expose activeOrNaturalSummarize ([3be69fa](https://github.com/cheminfo/mass-tools/commit/3be69fadd481deba2ca60e4a1b8e6e0e7f9449ea))
* text search to summarize activeOrNatural entry ([78a4112](https://github.com/cheminfo/mass-tools/commit/78a41127fa2ffd4e2375956bf164b141b257bfc9))


### Bug Fixes

* activeOrNaturalSummarize ([a525411](https://github.com/cheminfo/mass-tools/commit/a525411c7ca77758e6d856ffeedfafcbe763fb5a))
* add +2 to nbCompounds to avoid dividing by 0 ([5d60062](https://github.com/cheminfo/mass-tools/commit/5d6006204b3979e22895e7ac33ba36f9633b39e6))

## [7.1.0](https://github.com/cheminfo/mass-tools/compare/v7.0.0...v7.1.0) (2023-05-24)


### Features

* **octochemdb:** sort by default activesOrNaturals by nbMassSpectra ([cbcf4d2](https://github.com/cheminfo/mass-tools/commit/cbcf4d25a61d9a5f02e29b8418f53bf393ae86e4))

## [7.0.0](https://github.com/cheminfo/mass-tools/compare/v6.12.0...v7.0.0) (2023-05-24)


### ⚠ BREAKING CHANGES

* move searchGNPS to OctoChemDB
* remove searchPubchem, searchActivesOrNaturals, searchAndGroupActivesOrNaturals

### Features

* **mf-parser:** possibility to customize getInfo fieldNames for em ([d4e422e](https://github.com/cheminfo/mass-tools/commit/d4e422e6c226f444afdb10523274161cd2b36ff1))
* move searchGNPS to OctoChemDB ([abff44a](https://github.com/cheminfo/mass-tools/commit/abff44abe763e8c033c788102c5449bba610111f))
* **octochemdb:** add activeOrNaturalDetails ([610f7b1](https://github.com/cheminfo/mass-tools/commit/610f7b14ecfe3d6d582966421911ac15e71c2771))
* **octochemdb:** add activeOrNaturalSummarize ([ca852b7](https://github.com/cheminfo/mass-tools/commit/ca852b70e540227665a7ca65793c25ef3d7ffe38))
* **octochemdb:** add activesOrNaturals and activesOrNaturalsByMF ([9a31172](https://github.com/cheminfo/mass-tools/commit/9a311727a592198fe91c23639bd7f2968eb753ae))
* **octochemdb:** add package and mfsFromEM ([6d97f90](https://github.com/cheminfo/mass-tools/commit/6d97f900bb97226b460cf758869164d93e12924f))
* **octochemdb:** allow to retrieve thousands of patents in activesOrNaturalsDetailllllllls ([c8425c5](https://github.com/cheminfo/mass-tools/commit/c8425c591ced79f2f42342e7b1a9d6f684001a5b))
* use octochemdb.cheminfo.org and refactor searchActivesOrNaturals ([d216a82](https://github.com/cheminfo/mass-tools/commit/d216a8207e2ac507da6a20b2331b94ed5d866833))


### Bug Fixes

* **mass-tools:** expose getBestPeaks that was removed in a previous commit ([d585116](https://github.com/cheminfo/mass-tools/commit/d585116af22c8ab3be8003826357d662144131ee))
* **mf-finder:** minCharge and maxCharge was incorrectly managed by TargetMassCache ([dd53e2e](https://github.com/cheminfo/mass-tools/commit/dd53e2e693738367e2a8c7056ed37e44a0a042d4))


### Miscellaneous Chores

* remove searchPubchem, searchActivesOrNaturals, searchAndGroupActivesOrNaturals ([bac4a83](https://github.com/cheminfo/mass-tools/commit/bac4a83be1093b5b75bebcb9af50bd99ec9d1a4e))

## [6.12.0](https://github.com/cheminfo/mass-tools/compare/v6.11.0...v6.12.0) (2023-04-28)


### Features

* **mf-matcher:** allow filtering by absolute charge ([8e45b1d](https://github.com/cheminfo/mass-tools/commit/8e45b1d98fdfa080e6c0b2fba0af1f8b1ac8121b))

## [6.11.0](https://github.com/cheminfo/mass-tools/compare/v6.10.1...v6.11.0) (2023-03-28)


### Features

* **isotopic-distribution:** add getVariables method ([fc452b9](https://github.com/cheminfo/mass-tools/commit/fc452b948a7341797d5dbd14ada81d664ed8f9a6))

## [6.10.1](https://github.com/cheminfo/mass-tools/compare/v6.10.0...v6.10.1) (2023-03-25)


### Bug Fixes

* update dependencies ([ea54f52](https://github.com/cheminfo/mass-tools/commit/ea54f529fb5c4683937e1264e0bdc5e9b90d90af))

## [6.10.0](https://github.com/cheminfo/mass-tools/compare/v6.9.0...v6.10.0) (2023-03-21)


### Features

* add selectedMasses options in MSComparator ([31f830a](https://github.com/cheminfo/mass-tools/commit/31f830a9f25c13a5c9f1ae8d0c16318ac327b63a))


### Bug Fixes

* update dependencies ([5561677](https://github.com/cheminfo/mass-tools/commit/5561677a490ae59abe196279ce7c0e66f1537ffb))

## [6.9.0](https://github.com/cheminfo/mass-tools/compare/v6.8.0...v6.9.0) (2023-03-21)


### Features

* getInfo returns the sum if many parts ([b96a6d6](https://github.com/cheminfo/mass-tools/commit/b96a6d605af0d01bf9bac54de341c27f6c19a8c3))

## [6.8.0](https://github.com/cheminfo/mass-tools/compare/v6.7.0...v6.8.0) (2023-02-17)


### Features

* **ms-spectrum:** MSComparator has 2 new options: requiredY and minNbCommonPeaks ([3fa3ea5](https://github.com/cheminfo/mass-tools/commit/3fa3ea55450c899000b600a76da8b271e50a02ea))

## [6.7.0](https://github.com/cheminfo/mass-tools/compare/v6.6.0...v6.7.0) (2023-02-14)


### Features

* **mass-tools:** expose searchGNPS ([5d57a09](https://github.com/cheminfo/mass-tools/commit/5d57a09826586f87b94457e657ad38dde185620f))

## [6.6.0](https://github.com/cheminfo/mass-tools/compare/v6.5.0...v6.6.0) (2023-02-14)


### Features

* **mass-tools:** expose ensureCase ([316aa11](https://github.com/cheminfo/mass-tools/commit/316aa11e451fc753015de1007f528274d5c20ca9))
* **ms-spectrum:** add minMaxX ([af77171](https://github.com/cheminfo/mass-tools/commit/af771710b594d489333115fdae090658b184f47a))
* **ms-spectrum:** create searchGNPS ([3bb28ba](https://github.com/cheminfo/mass-tools/commit/3bb28ba71e8ac61a4f4cdc118cbb0ad59b84f010))


### Bug Fixes

* isContinuous was not correcly allowing fails ([c3e705a](https://github.com/cheminfo/mass-tools/commit/c3e705a108daa4944f54f565971ce4601986e6ac))

## [6.5.0](https://github.com/cheminfo/mass-tools/compare/v6.4.1...v6.5.0) (2023-01-30)


### Features

* add CITATION.cff ([eabded5](https://github.com/cheminfo/mass-tools/commit/eabded55fa5896f55f251db0e654906cfa2c69cf))

## [6.4.1](https://github.com/cheminfo/mass-tools/compare/v6.4.0...v6.4.1) (2023-01-11)


### Bug Fixes

* **emdb:** increase timeout on search.test ([e23b3c5](https://github.com/cheminfo/mass-tools/commit/e23b3c532cd947bcd167f128807c7037bb61d8b9))
* **emdb:** increase timeout on searchCommercials.test ([a8d6a0b](https://github.com/cheminfo/mass-tools/commit/a8d6a0b7526fde6f703af108fcb90615ad35a9c0))
* increase timeout to avoid test failing ([95fb021](https://github.com/cheminfo/mass-tools/commit/95fb021b1dfc74dd4bed842cbf86432ee3e5970a))

## [6.4.0](https://github.com/cheminfo/mass-tools/compare/v6.3.0...v6.4.0) (2023-01-11)


### Features

* add T as group (synonym of 3H) ([1ad569a](https://github.com/cheminfo/mass-tools/commit/1ad569a6ad080442434bb9bb44be9f442fdb1833))

## [6.3.0](https://github.com/cheminfo/mass-tools/compare/v6.2.0...v6.3.0) (2022-12-20)


### Features

* **mf-finder:** Add docs and filter options to mfIncluded ([1c532f3](https://github.com/cheminfo/mass-tools/commit/1c532f3fb01e9a42db619d4fdde9334a4538b066))
* **ms-spectrum:** add class MSComparator to get spectra similarity ([f794da6](https://github.com/cheminfo/mass-tools/commit/f794da6cdb8426ffdcec1585e70263f1e0b74890))

## [6.2.0](https://github.com/cheminfo/mass-tools/compare/v6.1.0...v6.2.0) (2022-12-16)


### Features

* **mf-finder:** add method mfIncluded ([88e937c](https://github.com/cheminfo/mass-tools/commit/88e937c65dd6b628783bffdce79f42d9eb95512f))

## [6.1.0](https://github.com/cheminfo/mass-tools/compare/v6.0.2...v6.1.0) (2022-12-13)


### Features

* add options in mass-fragmentation to select the fragments to generate ([28eaea5](https://github.com/cheminfo/mass-tools/commit/28eaea5967d9b55c74d412acf1d1db4f4d16b2f5))
* **emdb:** add count in fromMolecules ([bd9fab5](https://github.com/cheminfo/mass-tools/commit/bd9fab5398713d10b00fe93afb92c2c6c7e1ea29))
* **emdb:** add method fromMolecules ([ecde199](https://github.com/cheminfo/mass-tools/commit/ecde199ddc31d75ffa849a6a8cefbb1d1965905e))
* **mass-fragmentation:** add package mass-fragmentation ([1e858bd](https://github.com/cheminfo/mass-tools/commit/1e858bd774eb3ec5f4a443c2c25262dd8849ac70))

## [6.0.2](https://github.com/cheminfo/mass-tools/compare/v6.0.1...v6.0.2) (2022-12-06)


### Bug Fixes

* create more compatible build of mass-tools ([7b6ded6](https://github.com/cheminfo/mass-tools/commit/7b6ded63bb6aa4d1cab7da8f5521a7cae6b5cc09))

## [6.0.1](https://github.com/cheminfo/mass-tools/compare/v6.0.0...v6.0.1) (2022-12-05)


### Bug Fixes

* build script for lerna publish ([cfca9a8](https://github.com/cheminfo/mass-tools/commit/cfca9a82790ee5e7470cfb3f0009162a4b1acda6))

## [6.0.0](https://github.com/cheminfo/mass-tools/compare/v5.11.2...v6.0.0) (2022-12-05)


### ⚠ BREAKING CHANGES

* remove default export from all the packages
* **emdb:** rename DBManager to EMDB
* **emdb:** remove IsotopicDistribution and MFParser. You should use mass-tools to have those 2 librairies

### Miscellaneous Chores

* **emdb:** remove IsotopicDistribution and MFParser. You should use mass-tools to have those 2 librairies ([e6a3cc1](https://github.com/cheminfo/mass-tools/commit/e6a3cc1c0bee0fa8c483da572ab9e56cd409b34d))
* **emdb:** rename DBManager to EMDB ([e6a3cc1](https://github.com/cheminfo/mass-tools/commit/e6a3cc1c0bee0fa8c483da572ab9e56cd409b34d))
* remove default export from all the packages ([e6a3cc1](https://github.com/cheminfo/mass-tools/commit/e6a3cc1c0bee0fa8c483da572ab9e56cd409b34d))

## [5.11.2](https://github.com/cheminfo/mass-tools/compare/v5.11.1...v5.11.2) (2022-11-02)


### Bug Fixes

* **mf-from-google-sheet:** remove request library ([b2ceec4](https://github.com/cheminfo/mass-tools/commit/b2ceec4a5826a5ec86af42631ed3680eb6efcc45))

## [5.11.1](https://github.com/cheminfo/mass-tools/compare/v5.11.0...v5.11.1) (2022-10-24)


### Bug Fixes

* ensureUniqueMF bug because not sorted ([e6790e7](https://github.com/cheminfo/mass-tools/commit/e6790e790335f6122566cdad86b79d42a7d44927))

## [5.11.0](https://github.com/cheminfo/mass-tools/compare/v5.10.1...v5.11.0) (2022-10-19)


### Features

* add option 'uniqueMFs' in fromMonoisotopicMass ([7f294ed](https://github.com/cheminfo/mass-tools/commit/7f294edd9acc44b6527ff974d99d3974b9d7bc2d))

## [5.10.1](https://github.com/cheminfo/mass-tools/compare/v5.10.0...v5.10.1) (2022-10-19)


### Bug Fixes

* rename getRangeForFragment to getRangesForFragment ([c415157](https://github.com/cheminfo/mass-tools/commit/c4151579a9c54f6ef0261d4ff38a90d7d36791fd))

## [5.10.0](https://github.com/cheminfo/mass-tools/compare/v5.9.0...v5.10.0) (2022-10-18)


### Features

* add getRangeForFragment ([6f34dbc](https://github.com/cheminfo/mass-tools/commit/6f34dbcfc283f09dd76f8d47859f5f0ad3a82af4))
* expose preprocessRanges in mf-utilities ([c6ba497](https://github.com/cheminfo/mass-tools/commit/c6ba4977c1d84f5d3da218819b392c470f4f4b74))
* use new pubchem.cheminfo api ([700b4de](https://github.com/cheminfo/mass-tools/commit/700b4de8f2b277c845116925d70adae4a0fa0ce9))

## [5.9.0](https://github.com/cheminfo/mass-tools/compare/v5.8.2...v5.9.0) (2022-08-03)


### Features

* add nbWithMassSpectra in searchActivesOrNaturals ([97f6f53](https://github.com/cheminfo/mass-tools/commit/97f6f5395f772a6b4aeeda5dc9fa9ea1292377e4))

## [5.8.2](https://github.com/cheminfo/mass-tools/compare/v5.8.1...v5.8.2) (2022-07-20)


### Bug Fixes

* use em to check if searchPubchem and searchActives are in the range ([3130ac8](https://github.com/cheminfo/mass-tools/commit/3130ac8867d79427a546a73d914d86c03e4fa183))

## [5.8.1](https://github.com/cheminfo/mass-tools/compare/v5.8.0...v5.8.1) (2022-07-20)


### Bug Fixes

* searchActivesOrNaturals and problem of S0 ([96fbf7e](https://github.com/cheminfo/mass-tools/commit/96fbf7e0d9d18b22a2661291239690e95bd3c092))

## [5.8.0](https://github.com/cheminfo/mass-tools/compare/v5.7.0...v5.8.0) (2022-07-12)


### Features

* allow range filtering in searchPubchem ([f9dbdf1](https://github.com/cheminfo/mass-tools/commit/f9dbdf1cfa3c5d014023fc29b69eaad7f4da5bd7))

## [5.7.0](https://github.com/cheminfo/mass-tools/compare/v5.6.0...v5.7.0) (2022-07-12)


### Features

* allow to searchActivesOrNaturals with range filter ([8179e41](https://github.com/cheminfo/mass-tools/commit/8179e414f59df7c97b29776439b62ed1fc5fe396))

## [5.6.0](https://github.com/cheminfo/mass-tools/compare/v5.5.4...v5.6.0) (2022-07-05)


### Features

* add searchActivesOrNaturals ([515b4e0](https://github.com/cheminfo/mass-tools/commit/515b4e0ccd45c79cfcf740fc9187048fc03e547b))


### Bug Fixes

* **isotopic-distribution:** in case minY is too big and no peaks are found ([a0fdc29](https://github.com/cheminfo/mass-tools/commit/a0fdc2947fa807d78a41cbea8fbe2ca8c2fab2a8))

### [5.5.4](https://github.com/cheminfo/mass-tools/compare/v5.5.3...v5.5.4) (2022-05-09)


### Bug Fixes

* **ms-report:** correct end group terminal replacement ([7a1c937](https://github.com/cheminfo/mass-tools/commit/7a1c9373666b0d38762a8e03b005c24ff6ddee57))
* rename fetch to avoid conflict with new native fetch function ([aff7aa8](https://github.com/cheminfo/mass-tools/commit/aff7aa859f81e3d10192566bc04f7a8bb90bdcf9))

### [5.5.3](https://github.com/cheminfo/mass-tools/compare/v5.5.2...v5.5.3) (2022-03-25)


### Bug Fixes

* update dependencies ([cc52abb](https://github.com/cheminfo/mass-tools/commit/cc52abb8cf7dd65920b190983b2458e141e425d8))
* update more dependencies ([51dd258](https://github.com/cheminfo/mass-tools/commit/51dd25847065f6981fba583ad656d7432d7803c8))

### [5.5.2](https://github.com/cheminfo/mass-tools/compare/v5.5.1...v5.5.2) (2022-03-04)


### Bug Fixes

* update dependencies ([#71](https://github.com/cheminfo/mass-tools/issues/71)) ([9ea23b6](https://github.com/cheminfo/mass-tools/commit/9ea23b6683d32489b26b0f9abda97dc69fffaca3))

### [5.5.1](https://www.github.com/cheminfo/mass-tools/compare/v5.5.0...v5.5.1) (2022-02-15)


### Bug Fixes

* import emdb in getFragmentPeaks ([986ad0b](https://www.github.com/cheminfo/mass-tools/commit/986ad0bddfc5798ec0c9f369f5a178aaf18019f2))

## [5.5.0](https://www.github.com/cheminfo/mass-tools/compare/v5.4.0...v5.5.0) (2022-02-15)


### Features

* **ms-spectrum:** add getFragmentPeaks ([1e68a66](https://www.github.com/cheminfo/mass-tools/commit/1e68a666f81565d61ced7e1d53b831c424199dd0))


### Bug Fixes

* update gsd dependency ([3253310](https://www.github.com/cheminfo/mass-tools/commit/3253310c49e0b9b4915605a1356ac7620430ca69))

## [5.4.0](https://www.github.com/cheminfo/mass-tools/compare/v5.3.0...v5.4.0) (2022-02-14)


### Features

* **ms-report:** add minRelativeQuantity ([86bfaea](https://www.github.com/cheminfo/mass-tools/commit/86bfaea28732442344dbc0b5cc0189e568aa26eb))

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
