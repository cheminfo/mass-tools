'use strict';

// returns a window with a document and an svg root node
const { writeFileSync } = require('fs');
const { join } = require('path');

const window = require('svgdom');

const document = window.document;
const { SVG, registerWindow } = require('@svgdotjs/svg.js');

// register window and document
registerWindow(window, document);

// create canvas
const paper = SVG(document.documentElement);

// use svg.js as normal
paper
  .rect(500, 100)
  .fill('yellow')
  .move(50, 50);

let labels = ['A', 'BCD', 'EF', 'GHI'];

for (let label of labels) {
  let text = paper.text(label);
  text.font({
    family: 'Verdana',
    size: 14,
    weight: 'bold',
    fill: '#888'
  });
  console.log(text.length());
}

writeFileSync(join(__dirname, 'test.svg'), paper.svg());
