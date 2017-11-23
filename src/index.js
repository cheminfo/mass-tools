'use strict';

const toDisplay = require('./util/toDisplay');
const parse = require('./parse');
const toHtml = require('./util/toHtml');

function parseToHtml(mf) {
    var parsed = parse(mf);
    console.log(parsed);
    var display = toDisplay(parsed);
    console.log(display);
    return toHtml(display);
}

module.exports = {
    Kind: require('./Kind'),
    Format: require('./Format'),
    parse: require('./parse'),
    toDisplay,
    toHtml,
    parseToHtml,
};
