'use strict';

const window = require('svgdom');

const document = window.document;
const { SVG, registerWindow } = require('@svgdotjs/svg.js');

registerWindow(window, document);

function getPaper() {
  return SVG(document.documentElement);
}

module.exports = getPaper;
