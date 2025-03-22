# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.4.2](https://github.com/cheminfo/mass-tools/compare/mf-parser@3.4.1...mf-parser@3.4.2) (2025-03-22)


### Bug Fixes

* **mf-parser:** getNumberOfIsotopologues always returns a number. 0 if no stable isotopoe of no MF ([ece391a](https://github.com/cheminfo/mass-tools/commit/ece391ab98a75eec89c42e9ca06cfb4309d15760))
* **mf-parser:** mf.getInfo always returns the nbIsotopologues property ([032b1da](https://github.com/cheminfo/mass-tools/commit/032b1da800ac360aa0e422b19de1702d7553687b))
* **mf-parser:** rename types PartInfo -> MFInfo, PartInfoWithParts -> MFInfoWithParts ([3388b75](https://github.com/cheminfo/mass-tools/commit/3388b7561527ea41f7ffa93c297964dce292b746))
* **mf-parser:** toParts({expand:false}) does not have side effects anymore ([dec8cf9](https://github.com/cheminfo/mass-tools/commit/dec8cf910fffa5b224cef00b5e2d710a461d546f))





## [3.4.1](https://github.com/cheminfo/mass-tools/compare/mf-parser@3.4.0...mf-parser@3.4.1) (2025-03-20)

**Note:** Version bump only for package mf-parser





# [3.4.0](https://github.com/cheminfo/mass-tools/compare/mf-parser@3.3.1...mf-parser@3.4.0) (2025-03-15)


### Features

* **mf-parser:** remove useless surrounding parenthesis and 1 multiplier when displaying a MF ([#262](https://github.com/cheminfo/mass-tools/issues/262)) ([a9b9947](https://github.com/cheminfo/mass-tools/commit/a9b99479c4d145b228a5b2f721a0d77d41f48bef))





## [3.3.1](https://github.com/cheminfo/mass-tools/compare/mf-parser@3.3.0...mf-parser@3.3.1) (2025-03-10)


### Bug Fixes

* **mf-parser:** toDisplay deals correctly with simple charges ([#261](https://github.com/cheminfo/mass-tools/issues/261)) ([42d2b7a](https://github.com/cheminfo/mass-tools/commit/42d2b7a6d0f6778fc0b01cd4c17bd3e8e475452b))
* **mf-utilities:** types returned by preprocessIonizations ([#258](https://github.com/cheminfo/mass-tools/issues/258)) ([629973d](https://github.com/cheminfo/mass-tools/commit/629973d8175d3d3b0c75d1a488cfc83261c578f4))





# [3.3.0](https://github.com/cheminfo/mass-tools/compare/mf-parser@3.2.8...mf-parser@3.3.0) (2024-12-18)


### Features

* **mf-parser:** allow decimal isotopic composition ([#253](https://github.com/cheminfo/mass-tools/issues/253)) ([9696c50](https://github.com/cheminfo/mass-tools/commit/9696c50b180913bfbf3d193ff7cda56e4e3d9bd6))





## [3.2.8](https://github.com/cheminfo/mass-tools/compare/mf-parser@3.2.7...mf-parser@3.2.8) (2024-12-17)


### Bug Fixes

* **mf-parser:** package.json exposes only main ([#247](https://github.com/cheminfo/mass-tools/issues/247)) ([7a77ffc](https://github.com/cheminfo/mass-tools/commit/7a77ffc4620c74ccacd0bf0d3cf6fda825017d35))





## [3.2.7](https://github.com/cheminfo/mass-tools/compare/mf-parser@3.2.6...mf-parser@3.2.7) (2024-12-12)


### Bug Fixes

* **mf-parser:** provide getInfo advanced typings ([#241](https://github.com/cheminfo/mass-tools/issues/241)) ([06a4121](https://github.com/cheminfo/mass-tools/commit/06a41211a12b98f35f47fbbca9442c9bae55ed8a)), closes [/github.com/cheminfo/mass-tools/pull/231#issuecomment-2518047600](https://github.com//github.com/cheminfo/mass-tools/pull/231/issues/issuecomment-2518047600)





## [3.2.6](https://github.com/cheminfo/mass-tools/compare/mf-parser@3.2.5...mf-parser@3.2.6) (2024-12-05)

**Note:** Version bump only for package mf-parser





## [3.2.5](https://github.com/cheminfo/mass-tools/compare/mf-parser@3.2.4...mf-parser@3.2.5) (2024-10-14)

**Note:** Version bump only for package mf-parser





## [3.2.4](https://github.com/cheminfo/mass-tools/compare/mf-parser@3.2.3...mf-parser@3.2.4) (2024-10-01)


### Bug Fixes

* generateMFs with charges was giving wrong results ([#213](https://github.com/cheminfo/mass-tools/issues/213)) ([e6d5ac1](https://github.com/cheminfo/mass-tools/commit/e6d5ac1be3ce31e1aa9e20b42984fd9da48d2669))





## [3.2.3](https://github.com/cheminfo/mass-tools/compare/mf-parser@3.2.2...mf-parser@3.2.3) (2024-08-06)

**Note:** Version bump only for package mf-parser





## [3.2.2](https://github.com/cheminfo/mass-tools/compare/mf-parser@3.2.1...mf-parser@3.2.2) (2024-07-31)


### Bug Fixes

* **isotopic-distribution:** deal correctly with isotopologues in case of non natural isotopic distribution ([74684ba](https://github.com/cheminfo/mass-tools/commit/74684ba33cd61023bec0ce13eec88873e2458893))
* **mf-parser:** getIsotopesInfo set correctly in the atom property the atom and not the isotope or enriched isotope ([43f1046](https://github.com/cheminfo/mass-tools/commit/43f1046b17274f8d739df6230f57eee038610ced))





## [3.2.1](https://github.com/cheminfo/mass-tools/compare/mf-parser@3.2.0...mf-parser@3.2.1) (2024-07-08)


### Bug Fixes

* enable unicorn ESLint plugin and fix errors ([9303048](https://github.com/cheminfo/mass-tools/commit/93030488bbbd5879dc4639a5d0c81c7664a927b8))
* improve types in isotopic-distribution and mf-parser ([#202](https://github.com/cheminfo/mass-tools/issues/202)) ([e5769cd](https://github.com/cheminfo/mass-tools/commit/e5769cd588adb69974abfa60f411bc2dc1887fa6))





# [3.2.0](https://github.com/cheminfo/mass-tools/compare/mf-parser@3.1.1...mf-parser@3.2.0) (2024-06-26)


### Features

* generate TS typings from jsdoc ([#196](https://github.com/cheminfo/mass-tools/issues/196)) ([c6ca610](https://github.com/cheminfo/mass-tools/commit/c6ca610976e04d851420f8b65d8220d39f64a83b))





## [3.1.1](https://github.com/cheminfo/mass-tools/compare/mf-parser@3.1.0...mf-parser@3.1.1) (2024-05-10)


### Bug Fixes

* remove __tests__ from build ([7a6587e](https://github.com/cheminfo/mass-tools/commit/7a6587e2024a4c15763d751ccbdaa65baa5351e2))





# [3.1.0](https://github.com/cheminfo/mass-tools/compare/mf-parser@3.0.1...mf-parser@3.1.0) (2023-11-13)


### Features

* **mf-parser:** add 'flatten' to mf object to expand all the ranges ([1c461ea](https://github.com/cheminfo/mass-tools/commit/1c461ead14cb7054d26fcc7d7d84f69d955240c8))
* **mf-parser:** add flatten method on MF (and remove processRange) ([4e3c799](https://github.com/cheminfo/mass-tools/commit/4e3c79964c05f0fba33975069a1b442f4514976f))





## [3.0.1](https://github.com/cheminfo/mass-tools/compare/mf-parser@2.3.1...mf-parser@3.0.1) (2023-09-04)

**Note:** Version bump only for package mf-parser





# [3.0.0](https://github.com/cheminfo/mass-tools/compare/mf-parser@2.3.1...mf-parser@3.0.0) (2023-09-04)

**Note:** Version bump only for package mf-parser





## [2.3.1](https://github.com/cheminfo/mass-tools/compare/mf-parser@2.3.0...mf-parser@2.3.1) (2023-09-04)

**Note:** Version bump only for package mf-parser





# [2.3.0](https://github.com/cheminfo/mass-tools/compare/mf-parser@2.2.1...mf-parser@2.3.0) (2023-06-12)


### Features

* **mf-parser:** possibility to customize getInfo fieldNames for em ([d4e422e](https://github.com/cheminfo/mass-tools/commit/d4e422e6c226f444afdb10523274161cd2b36ff1))





## [2.2.1](https://github.com/cheminfo/mass-tools/compare/mf-parser@2.2.0...mf-parser@2.2.1) (2023-03-28)

**Note:** Version bump only for package mf-parser





# [2.2.0](https://github.com/cheminfo/mass-tools/compare/mf-parser@2.1.0...mf-parser@2.2.0) (2023-03-21)


### Features

* getInfo returns the sum if many parts ([b96a6d6](https://github.com/cheminfo/mass-tools/commit/b96a6d605af0d01bf9bac54de341c27f6c19a8c3))





# [2.1.0](https://github.com/cheminfo/mass-tools/compare/mf-parser@2.0.0...mf-parser@2.1.0) (2023-01-12)


### Features

* add T as group (synonym of 3H) ([1ad569a](https://github.com/cheminfo/mass-tools/commit/1ad569a6ad080442434bb9bb44be9f442fdb1833))





# [2.0.0](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.4.8...mf-parser@2.0.0) (2022-12-05)

**Note:** Version bump only for package mf-parser

## [1.4.8](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.4.7...mf-parser@1.4.8) (2022-12-05)

**Note:** Version bump only for package mf-parser

## [1.4.7](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.4.6...mf-parser@1.4.7) (2022-05-09)

**Note:** Version bump only for package mf-parser

## [1.4.6](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.4.5...mf-parser@1.4.6) (2022-03-25)

**Note:** Version bump only for package mf-parser

## [1.4.5](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.4.4...mf-parser@1.4.5) (2022-03-04)

### Bug Fixes

- update dependencies ([#71](https://github.com/cheminfo/mass-tools/issues/71)) ([9ea23b6](https://github.com/cheminfo/mass-tools/commit/9ea23b6683d32489b26b0f9abda97dc69fffaca3))

## [1.4.4](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.4.3...mf-parser@1.4.4) (2022-02-02)

**Note:** Version bump only for package mf-parser

## [1.4.3](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.4.2...mf-parser@1.4.3) (2022-02-01)

**Note:** Version bump only for package mf-parser

## [1.4.2](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.4.1...mf-parser@1.4.2) (2022-01-28)

**Note:** Version bump only for package mf-parser

## [1.4.1](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.4.0...mf-parser@1.4.1) (2022-01-25)

**Note:** Version bump only for package mf-parser

# [1.4.0](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.3.5...mf-parser@1.4.0) (2021-10-10)

### Features

- add MF toText and toCanonicText ([112f3da](https://github.com/cheminfo/mass-tools/commit/112f3da633534a9b4fe6a155e16c6d2324b29123))
- **mf-parser:** expose subscript / superscript UTF8 mapping ([cf009c9](https://github.com/cheminfo/mass-tools/commit/cf009c929c1b38cb80425b8ad46e325bbc9be754))

## [1.3.5](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.3.4...mf-parser@1.3.5) (2021-10-04)

**Note:** Version bump only for package mf-parser

## [1.3.4](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.3.3...mf-parser@1.3.4) (2021-09-07)

### Bug Fixes

- add missing mf-parser descriiption ([c0faa0d](https://github.com/cheminfo/mass-tools/commit/c0faa0d33bb9ad69e1766a31eee2ce1fe7a2e13d))

## [1.3.3](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.3.2...mf-parser@1.3.3) (2021-07-12)

**Note:** Version bump only for package mf-parser

## [1.3.2](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.3.1...mf-parser@1.3.2) (2021-06-16)

**Note:** Version bump only for package mf-parser

## [1.3.1](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.3.0...mf-parser@1.3.1) (2021-06-09)

**Note:** Version bump only for package mf-parser

# [1.3.0](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.2.1...mf-parser@1.3.0) (2021-06-09)

### Features

- add MF.getElements ([f1822bf](https://github.com/cheminfo/mass-tools/commit/f1822bf491536b73c0bac709784f03fb5fb7357b))

## [1.2.1](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.2.0...mf-parser@1.2.1) (2021-05-28)

**Note:** Version bump only for package mf-parser

# [1.2.0](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.1.10...mf-parser@1.2.0) (2021-04-20)

### Features

- allow to have anchors # in MF ([4c920ff](https://github.com/cheminfo/mass-tools/commit/4c920ffea6c4020471ef6d7c1df8985e48bb4395))
- format MF containing anchors ([dc8d469](https://github.com/cheminfo/mass-tools/commit/dc8d46986144dead0d92e607160c1746ca9c3fb0))

## [1.1.10](https://github.com/cheminfo/mass-tools/compare/mf-parser@1.1.9...mf-parser@1.1.10) (2021-03-24)

### Bug Fixes

- wrong links in some packages.json ([3c5829a](https://github.com/cheminfo/mass-tools/commit/3c5829a153dd198d56e7d54c065bf7e241ea0423))

## 1.1.9 (2021-03-16)

## 0.60.1 (2021-03-16)

**Note:** Version bump only for package mf-parser

## 1.1.8 (2021-03-15)

# 0.60.0 (2021-03-15)

**Note:** Version bump only for package mf-parser

## 1.1.7 (2021-03-12)

## 0.59.2 (2021-03-12)

**Note:** Version bump only for package mf-parser

## [1.1.6](https://github.com/cheminfo/mf-parser/compare/mf-parser@1.1.5...mf-parser@1.1.6) (2020-08-19)

**Note:** Version bump only for package mf-parser
