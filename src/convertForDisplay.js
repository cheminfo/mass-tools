'use strict';

const Kind = require('./kind');
const Format = require('./format');

module.exports = function convertForDisplay(lines) {
    let results = [];
    let result = {};
    for (let line of lines) {
        switch (line.kind) {
            case Kind.MULTIPLIER:
                result = {
                    kind: Format.SUBSCRIPT,
                    value: String(line.from) + String((line.to) ? '-' + line.to : '')
                };
                results.push(result);
                break;
            case Kind.CHARGE:
                if (result.kind === Format.SUBSCRIPT) {
                    result.kind = Format.SUPERIMPOSE;
                    result.over = line.value;
                } else {
                    result = {
                        kind: Format.SUPERSCRIPT,
                        value: line.value
                    };
                    results.push(result);
                }

                break;
            case Kind.ATOM:
                if (line.value.isotope) {
                    result = {
                        kind: Format.SUPERSCRIPT,
                        value: line.value.isotope
                    };
                    results.push(result);
                }
                if (result.kind === Format.TEXT) {
                    result.value += line.value.atom;
                } else {
                    result = {
                        kind: Format.TEXT,
                        value: line.value.atom
                    };
                    results.push(result);
                }
                break;
            case Kind.SALT:
                if (result.kind === Format.TEXT) {
                    result.value += '•';
                } else {
                    result = {
                        kind: Format.TEXT,
                        value: '•'
                    };
                    results.push(result);
                }
                break;
            default:
                if (result.kind === Format.TEXT) {
                    result.value += line.value;
                } else {
                    result = {
                        kind: Format.TEXT,
                        value: line.value
                    };
                    results.push(result);
                }
        }
    }
    return results;
};
