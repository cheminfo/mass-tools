/* eslint-disable no-console */

import fs from 'node:fs';
import path from 'node:path';

const refresh = false;
let text;
if (refresh) {
  const response = await fetch(
    'http://physics.nist.gov/cgi-bin/Compositions/stand_alone.pl?ele=&ascii=ascii2&isotype=all',
  );
  text = await response.text();
  fs.writeFileSync(path.join(import.meta.dirname, 'isotopes.txt'), text);
} else {
  text = String(
    fs.readFileSync(path.join(import.meta.dirname, 'isotopes.txt')),
  );
}

let lines = text.split(/[\n\r]+/).filter((a) => a.match(/^[ A-Za-z]+= /));

let elements = [];
let element = {};
let fields = {};
let isotope;
let number;
for (let line of lines) {
  let label = line.replace(/ =.*/, '');
  let value = line.replace(/.*?= /, '').replace('&nbsp;', '');
  switch (label) {
    case 'Atomic Number':
      number = Number(value);
      if (element.number !== number) {
        element = {
          number,
          isotopes: [],
        };
        elements.push(element);
      }
      isotope = {};
      element.isotopes.push(isotope);
      break;
    case 'Atomic Symbol':
      element.symbol = value.trim(' ');
      break;
    case 'Mass Number':
      isotope.nominal = Number(value);
      break;
    case 'Standard Atomic Weight':
      if (value.match(/^\d+/)) {
        element.mass = Number(value.replace(/\(.*/, ''));
      } else if (value.match(/^\[\d+]$/)) {
        element.mass = Number(value.slice(1, -1));
      } else if (value.startsWith('[')) {
        let number1 = Number(value.replace(/\[(.*),(.*)]/, '$1'));
        let number2 = Number(value.replace(/\[(.*),(.*)]/, '$2'));
        let middle = (number1 + number2) / 2;
        let length = (value.length - 3) / 2 - 1;
        element.mass = Number(String(middle).slice(0, length));
      }
      break;
    case 'Isotopic Composition':
      number = Number(value.replace(/\(.*/, ''));
      if (number) {
        isotope.abundance = number;
      }
      break;
    case 'Relative Atomic Mass':
      isotope.mass = Number(value.replace(/\(.*/, ''));
      if (isotope.nominal !== Math.round(isotope.mass)) {
        console.log('strange', isotope.nominal, isotope.mass);
      }
      break;
    case 'Notes':
      break;
    default:
  }
  fields[label] = true;
}

fs.writeFileSync(
  path.join(import.meta.dirname, 'isotopes.json'),
  JSON.stringify(elements),
);
