'use strict';

const { SVG } = require('@svgdotjs/svg.js');

function getPaper() {
  return SVG();
}

module.exports = getPaper;
