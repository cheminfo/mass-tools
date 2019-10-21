'use strict';

// original data: https://docs.google.com/spreadsheets/d/1SinZQ7doYeN1GCWWZ-SNhkxj4Z3RR8kGvyde8nT0LA4/edit?usp=sharing

// editor of groups.tsv

const fs = require('fs');
const { join } = require('path');

const targetDir = join(__dirname, '../../packages/chemical-groups/src/');

const Papa = require('papaparse');
const { MF, Kind } = require('mf-parser');
const elementsObject = require('chemical-elements/src/elementsObject');
const elementsAndIsotopesObject = require('chemical-elements/src/elementsAndIsotopesObject');

const MODULE = "'use strict';\nmodule.exports=";

var groups = Papa.parse(`${fs.readFileSync(`${__dirname}/groups.tsv`)}`, {
  header: true,
  delimiter: '\t'
}).data.filter((line) => line.symbol !== '');

// we will create an object for the elements
for (let group of groups) {
  let mf = group.mf;
  let mfObject = new MF(mf);
  let parts = mfObject.toParts()[0];
  if (group.oclID) {
    group.ocl = {
      value: group.oclID,
      coordinates: group.oclCoordinates
    };
  }
  delete group.oclCoordinates;
  delete group.oclID;
  if (!group.oneLetter) delete group.oneLetter;
  if (!group.alternativeOneLetter) delete group.alternativeOneLetter;
  group.mass = 0;
  group.monoisotopicMass = 0;
  group.unsaturation = (mfObject.getInfo().unsaturation - 1) * 2;

  group.elements = parts.map((part) => {
    let number = part.multiplier;
    let symbol;
    switch (part.kind) {
      case Kind.ATOM:
        {
          symbol = part.value;
          let element = elementsObject[symbol];
          if (!element) throw new Error(`element unknown: ${symbol} - ${part}`);
          group.mass += element.mass * number;
          group.monoisotopicMass += element.monoisotopicMass * number;
        }
        return { symbol, number };
      case Kind.ISOTOPE: {
        let element = elementsAndIsotopesObject[part.value.atom];
        if (!element) {
          throw new Error(`element unknown: ${part.value.atom} - ${part}`);
        }
        let isotope = element.isotopes.filter(
          (a) => a.nominal === part.value.isotope
        )[0];
        if (!isotope) {
          throw new Error(`isotope unknown: ${part.value.isotope} - ${part}`);
        }
        group.mass += isotope.mass * number;
        group.monoisotopicMass += isotope.mass * number;
        return { symbol: part.value.atom, number, isotope: part.value.isotope };
      }
      default:
        throw new Error(`unknown type: ${part.kind}`);
    }
  });
}

fs.writeFileSync(`${targetDir}/groups.js`, MODULE + JSON.stringify(groups));

var groupsObject = {};
groups.forEach((e) => {
  groupsObject[e.symbol] = e;
  e.symbol = undefined;
});
fs.writeFileSync(
  `${targetDir}/groupsObject.js`,
  MODULE + JSON.stringify(groupsObject)
);
