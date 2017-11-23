'use strict';

const Format = require('../Format');

const STYLE_SUPERIMPOSE = 'flex-direction: column;display: inline-flex;justify-content: center;text-align: left;vertical-align: middle;';
const STYLE_SUPERIMPOSE_SUP_SUB = 'line-height: 1; font-size: 70%';

module.exports = function getHtml(lines) {
    var html = [];
    for (let line of lines) {
        switch (line.kind) {
            case Format.SUBSCRIPT:
                html.push('<sub>' + line.value + '</sub>');
                break;
            case Format.SUPERSCRIPT:
                html.push('<sup>' + line.value + '</sup>');
                break;
            case Format.SUPERIMPOSE:
                html.push(`<span style="${STYLE_SUPERIMPOSE}">`);
                html.push(`<sup style="${STYLE_SUPERIMPOSE_SUP_SUB}">${line.over}</sup>`);
                html.push(`<sub style="${STYLE_SUPERIMPOSE_SUP_SUB}">${line.under}</sub>`);
                html.push('</span>');
                break;
            default:
                html.push(line.value);
        }
    }
    return html.join('');
};
