# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.4.3](https://github.com/cheminfo/mass-tools/compare/octochemdb@1.4.2...octochemdb@1.4.3) (2023-09-04)


### Bug Fixes

* fetchJSON use local test files ([55f222e](https://github.com/cheminfo/mass-tools/commit/55f222e9e412d043b4d124adaed3fc07c6e7f9cd))
* **octochemdb:** .only in tests ([a089f13](https://github.com/cheminfo/mass-tools/commit/a089f13c0818cd1dfe6632c154fd8d0db04dfd0a))
* **octochemdb:** fetch local files for activesOrNaturals ([39d3a89](https://github.com/cheminfo/mass-tools/commit/39d3a891df2cd622b52e41339682b37d8c41516c))
* **octochemdb:** missing package msw for tests ([00cf005](https://github.com/cheminfo/mass-tools/commit/00cf00593a5a933b70fdd01907a6ea62691d204d))
* **octochemdb:** retry if fetch fail ([8489705](https://github.com/cheminfo/mass-tools/commit/8489705bad049383dd7fa22fe79cdb4f99edb709))
* update all dependencies ([c1aee41](https://github.com/cheminfo/mass-tools/commit/c1aee417d98ee83caf88489dc60db7ee449c744e))
* use limit in tests to avoid timeout ([b2c102e](https://github.com/cheminfo/mass-tools/commit/b2c102e0b5f25963e7071d4f38ece8f622f60787))





## [1.4.2](https://github.com/cheminfo/mass-tools/compare/octochemdb@1.4.1...octochemdb@1.4.2) (2023-08-18)

**Note:** Version bump only for package octochemdb





## [1.4.1](https://github.com/cheminfo/mass-tools/compare/octochemdb@1.4.0...octochemdb@1.4.1) (2023-07-18)

**Note:** Version bump only for package octochemdb





# [1.4.0](https://github.com/cheminfo/mass-tools/compare/octochemdb@1.3.0...octochemdb@1.4.0) (2023-07-17)


### Bug Fixes

* add new field titles ([cadee5d](https://github.com/cheminfo/mass-tools/commit/cadee5d7cc691e9edd80d1bb5a03832484f0a28e))
* increased timeout ([ceffed3](https://github.com/cheminfo/mass-tools/commit/ceffed30fd2647533325fb5a3fb0fbd7a623e4fc))
* **octochemdb:** prevent double DB creating ([a925180](https://github.com/cheminfo/mass-tools/commit/a9251804deec2c0211ca8683378cd2be3a7a064e))
* searchTaxonomies filter instead of find ([f3b01fe](https://github.com/cheminfo/mass-tools/commit/f3b01fe66628719541b003fdc4d5af28ed140e4d))
* updated snapshot ([aafde06](https://github.com/cheminfo/mass-tools/commit/aafde06a8e52ab10094ae64b60448252b46245c4))


### Features

* get count of lowest children ([4f7b02a](https://github.com/cheminfo/mass-tools/commit/4f7b02a8f8179725edc92423373571372c6e9a7f))





# [1.3.0](https://github.com/cheminfo/mass-tools/compare/octochemdb@1.2.0...octochemdb@1.3.0) (2023-06-20)


### Features

* **octochemdb:** add callback for in-memory search DB preparation ([a89d628](https://github.com/cheminfo/mass-tools/commit/a89d628e5539f5814b603044666b08d9ff68d894))
* **octochemdb:** createTaxonomyTree ([31a58e6](https://github.com/cheminfo/mass-tools/commit/31a58e66a84bc0460972f67a3a360324e5dce111))





# [1.2.0](https://github.com/cheminfo/mass-tools/compare/octochemdb@1.1.1...octochemdb@1.2.0) (2023-06-19)


### Bug Fixes

* taxonomy type ([a9a01be](https://github.com/cheminfo/mass-tools/commit/a9a01be7a597b54902f1f4bef2e40c60fede1f68))
* test cases ([a0393fd](https://github.com/cheminfo/mass-tools/commit/a0393fdb94cffaf4ebc2cc944e9e4697470eb57e))


### Features

* **octochemdb:** add compoundsFromMF and append title ([679103d](https://github.com/cheminfo/mass-tools/commit/679103d065f4abf8dbd324e1e5d4b7990d7da628))
* **octochemdb:** add excludedCollections ([1a5f907](https://github.com/cheminfo/mass-tools/commit/1a5f907e68d49d795bbf4617adb0922ab46369a2))
* **octochemdb:** add taxonomyComparator ([bf0aa42](https://github.com/cheminfo/mass-tools/commit/bf0aa42d94c78e46282343a74cb8c27abe556e96))
* **octochemdb:** compoundsFromMF sorts results by title length ([90778bc](https://github.com/cheminfo/mass-tools/commit/90778bc45001747cfddc945d6dead40ac6038365))
* createTaxonomyTree ([2cd05f1](https://github.com/cheminfo/mass-tools/commit/2cd05f1ac0c2b2923d3e277567599624f3b9a04e))





## [1.1.1](https://github.com/cheminfo/mass-tools/compare/octochemdb@1.1.0...octochemdb@1.1.1) (2023-06-13)

**Note:** Version bump only for package octochemdb





# 1.1.0 (2023-06-12)


### Bug Fixes

* activeOrNaturalSummarize ([a525411](https://github.com/cheminfo/mass-tools/commit/a525411c7ca77758e6d856ffeedfafcbe763fb5a))
* add +2 to nbCompounds to avoid dividing by 0 ([5d60062](https://github.com/cheminfo/mass-tools/commit/5d6006204b3979e22895e7ac33ba36f9633b39e6))
* **octochemdb:** correctly summarize taxonomies ([ca91403](https://github.com/cheminfo/mass-tools/commit/ca91403aa4479233cd3188a47854e218cd13141a))


### Features

* db schema based on queryField and sort patents by nbCompounds ([fa76d88](https://github.com/cheminfo/mass-tools/commit/fa76d882388a4fdc06d7ec33eabd8bd9d6edb88d))
* normalize activities ([0f2a99a](https://github.com/cheminfo/mass-tools/commit/0f2a99aaa250cca23943f9a6e4f35eead35b753e))
* **octochemdb:** add activeOrNaturalDetails ([610f7b1](https://github.com/cheminfo/mass-tools/commit/610f7b14ecfe3d6d582966421911ac15e71c2771))
* **octochemdb:** add activeOrNaturalSummarize ([ca852b7](https://github.com/cheminfo/mass-tools/commit/ca852b70e540227665a7ca65793c25ef3d7ffe38))
* **octochemdb:** add activesOrNaturals and activesOrNaturalsByMF ([9a31172](https://github.com/cheminfo/mass-tools/commit/9a311727a592198fe91c23639bd7f2968eb753ae))
* **octochemdb:** add package and mfsFromEM ([6d97f90](https://github.com/cheminfo/mass-tools/commit/6d97f900bb97226b460cf758869164d93e12924f))
* **octochemdb:** add pubmedCompounds method ([4ebadd2](https://github.com/cheminfo/mass-tools/commit/4ebadd236088fbe01caa06e53013a47708a07cee))
* **octochemdb:** allow to retrieve thousands of patents in activesOrNaturalsDetailllllllls ([c8425c5](https://github.com/cheminfo/mass-tools/commit/c8425c591ced79f2f42342e7b1a9d6f684001a5b))
* **octochemdb:** expose activeOrNaturalSummarize ([3be69fa](https://github.com/cheminfo/mass-tools/commit/3be69fadd481deba2ca60e4a1b8e6e0e7f9449ea))
* **octochemdb:** sort by default activesOrNaturals by nbMassSpectra ([cbcf4d2](https://github.com/cheminfo/mass-tools/commit/cbcf4d25a61d9a5f02e29b8418f53bf393ae86e4))
* search taxonomies ([347da02](https://github.com/cheminfo/mass-tools/commit/347da02a11940392563d29faad28a30682cc402e))
* text search to summarize activeOrNatural entry ([78a4112](https://github.com/cheminfo/mass-tools/commit/78a41127fa2ffd4e2375956bf164b141b257bfc9))





# Change Log
