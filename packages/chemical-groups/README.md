# chemical-groups

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

Chemical groups used in organic chemistry, like `Ph`, `Tips` or `Ala`.

## Installation

`$ npm install --save chemical-groups`

## Usage

```js
import { groups, groupsObject, groupsToSequence } from 'chemical-groups';

groups.length;
// 299

groupsObject.Ala;
// {
//   symbol: 'Ala',
//   name: 'Alanine diradical',
//   mf: 'C3H5NO',
//   kind: 'aa',
//   oneLetter: 'A',
//   alternativeOneLetter: 'α',
//   ocl: { value: 'gNyDBaxmqR[fZjZ@', coordinates: '…' },
//   mass: 71.07801959624871,
//   monoisotopicMass: 71.03711378515,
//   unsaturation: 2,
//   elements: [{ symbol: 'C', number: 3 }, …],
// }

groupsToSequence('HOAlaGlyOH');
// 'AG'
```

The `Group`, `GroupElement`, `GroupOcl` and `Kind` types are exported as well.

## What a group carries

- `symbol` and `name`, like `Ala` and `Alanine diradical`.
- `mf`, the molecular formula of the group without its R atoms.
- `mass`, `monoisotopicMass`, `unsaturation` and `elements`, all computed from
  `mf` by [`mf-parser`](https://github.com/cheminfo/mass-tools).
- `ocl`, the structure as an
  [openchemlib](https://github.com/cheminfo/openchemlib-js) idcode with its
  2D coordinates, R attachment points included.
- `oneLetter` and `alternativeOneLetter` on the amino acids and the
  nucleotides, like `A` and `α` for `Ala`.
- `kind`, the family the group belongs to. See below.
- `toVerify`, on a group whose structure was generated instead of drawn and
  still has to be checked by a human.

`R`, `R1`, `R2` and `R3` are the attachment points. They are ordinary
openchemlib atoms with their own atomic numbers (154, 142, 143, 144), so they
appear in the structure but are excluded from `mf`. A monoradical uses `R`, a
diradical `R1` on the amine side and `R2` on the carbonyl side, a triradical
adds `R3` for the side chain.

## The data file

`src/groups.ts` holds the whole list on a single line of compact JSON, so that
editing one group produces a one-group diff instead of a whole-file one. It is
listed in the repository `.prettierignore` and in the eslint `globalIgnores`
for that reason. Never edit it by hand, and never reformat it.

### Kinds

`kind` says which family a group belongs to. The vocabulary is closed — the
`Kind` type and the test suite both hold the list — and a group that is part of
no biopolymer, such as a protecting group or a substituent, carries no kind.
50 of the 299 groups carry none.

| Kind       | What it is                                      | Groups |
| ---------- | ----------------------------------------------- | ------ |
| `aa`       | Amino acid residue                              | 63     |
| `DNA`      | Deoxyribonucleoside, no phosphate               | 5      |
| `DNAp`     | Deoxyribonucleotide monophosphate               | 6      |
| `DNApp`    | Deoxyribonucleotide diphosphate                 | 5      |
| `DNAppp`   | Deoxyribonucleotide triphosphate                | 5      |
| `RNA`      | Ribonucleoside, no phosphate                    | 5      |
| `RNAp`     | Ribonucleotide monophosphate                    | 7      |
| `RNApp`    | Ribonucleotide diphosphate                      | 5      |
| `RNAppp`   | Ribonucleotide triphosphate                     | 5      |
| `RNApMod`  | Modified ribonucleotide monophosphate, Modomics | 135    |
| `RNAppMod` | The same as diphosphate: the 5′ caps            | 4      |
| `RNAEnd`   | A 5′ end that terminates the chain              | 4      |

A group of one of the chain kinds carries the `R1` and `R2` that let it extend
a chain, and an `RNAEnd` carries a single attachment point, so it can only
close one. `Furp` is the exception: it is an `RNAp` with a single `R`.

## Editing the groups

The groups are edited with the
[chemical-groups-editor](https://github.com/cheminfo/chemical-groups-editor)
repository, checked out next to the `mass-tools` one, at
`../chemical-groups-editor`:

```console
git clone https://github.com/cheminfo/chemical-groups-editor.git
cd chemical-groups-editor
npm install
npm run dev
```

The editor finds this package as a sibling checkout and reads and writes
`src/groups.ts` directly, keeping the layout of the file untouched. It lists
the groups with their structures, offers a structure editor, and reports every
group whose structure and formula disagree. It also removes `toVerify` when you
mark a group as checked.

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/chemical-groups.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/chemical-groups
[download-image]: https://img.shields.io/npm/dm/chemical-groups.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/chemical-groups
