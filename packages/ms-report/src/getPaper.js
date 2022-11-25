const { SVG, registerWindow } = require('@svgdotjs/svg.js');
const window = require('svgdom');

const document = window.document;
registerWindow(window, document);

function getPaper() {
  return SVG(document.documentElement);
}

module.exports = getPaper;
