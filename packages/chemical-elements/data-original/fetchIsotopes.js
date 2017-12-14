'use strict';

const fetch = require('node-fetch');
const fs = require('fs');

async function retrieve(refresh = false) {

    var text;
    if (refresh) {
        var response = await fetch('http://physics.nist.gov/cgi-bin/Compositions/stand_alone.pl?ele=&ascii=ascii2&isotype=all');
        text = await response.text();
        fs.writeFileSync(__dirname + '/isotopes.txt', text);
    } else {
        text = String(fs.readFileSync(__dirname + '/isotopes.txt'));
    }
    var lines = text.split(/[\r\n]+/).filter((a) => a.match(/^[a-zA-Z ]+= /));

    var elements = [];
    var element = {};
    var fields = {};
    var isotope;
    var number;
    for (var line of lines) {
        var label = line.replace(/ =.*/, '');
        var value = line.replace(/.*?= /, '').replace('&nbsp;', '');
        switch (label) {
            case 'Atomic Number':
                number = Number(value);
                if (element.number !== number) {
                    element = {
                        number,
                        isotopes: []
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
                if (value.match(/^[0-9]+/)) {
                    element.mass = Number(value.replace(/\(.*/, ''));
                } else if (value.match(/^\[[0-9]+\]$/)) {
                    element.mass = Number(value.substring(1, value.length - 1));
                } else if (value.startsWith('[')) {
                    let number1 = Number(value.replace(/\[(.*),(.*)\]/, '$1'));
                    let number2 = Number(value.replace(/\[(.*),(.*)\]/, '$2'));
                    let middle = (number1 + number2) / 2;
                    let length = (value.length - 3) / 2 - 1;
                    element.mass = Number(String(middle).substring(0, length));
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
                if (isotope.nominal !== Math.round(isotope.mass)) console.log('strange', isotope.nominal, isotope.mass);
                break;
            case 'Notes':
                break;
            default:

        }
        fields[label] = true;
    }

    fs.writeFileSync(__dirname + '/isotopes.json', JSON.stringify(elements));
}

retrieve();
