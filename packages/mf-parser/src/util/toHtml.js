'use strict';

const Format = require('../Format');

const Style = require('../Style');

module.exports = function getHtml(lines) {
    var html = [];
    for (let line of lines) {
        switch (line.kind) {
            case Format.SUBSCRIPT:
                html.push(`<sub>${line.value}</sub>`);
                break;
            case Format.SUPERSCRIPT:
                html.push(`<sup>${line.value}</sup>`);
                break;
            case Format.SUPERIMPOSE:
                html.push(`<span style="${Style.SUPERIMPOSE}">`);
                html.push(`<sup style="${Style.SUPERIMPOSE_SUP_SUB}">${line.over}</sup>`);
                html.push(`<sub style="${Style.SUPERIMPOSE_SUP_SUB}">${line.under}</sub>`);
                html.push('</span>');
                break;
            default:
                html.push(line.value);
        }
    }
    return html.join('');
};
