'use strict';

const window = require('svgdom');

const document = window.document;
const { SVG, registerWindow } = require('@svgdotjs/svg.js');

registerWindow(window, document);

const sequenceSplitter = require('./sequenceSplitter');

function getResiduesInfo(sequence, options = {}) {
  const {
    leftRightBorders = 20,
    spaceBetweenResidues = 20,
    labelFontFamily = 'Verdana',
    width = 600
  } = options;
  let residues = [];
  let mfParts = sequenceSplitter(sequence);

  let xPos = leftRightBorders;
  let xOld = xPos;

  let line = 0;
  // we create a temporary paper in order to get the width of the text blocs

  const paper = SVG(document.documentElement);

  for (let i = 0; i < mfParts.length; i++) {
    let part = mfParts[i];
    let text = paper.text(part);
    text.font({
      family: labelFontFamily,
      size: 12,
      weight: 'bold',
      fill: '#888'
    });

    let textWidth = text.length();
    text.remove();

    xPos += textWidth;
    if (xPos > width - leftRightBorders) {
      xOld = leftRightBorders;
      xPos = leftRightBorders + textWidth;
      line++;
    }

    residues.push({
      nTer: i,
      cTer: mfParts.length - i,
      label: part,
      xFrom: xOld,
      xTo: xPos,
      line,
      usedSlots: [],
      topPosition: 0,
      bottomPosition: 0
    });
    xPos += spaceBetweenResidues;
    xOld = xPos;
  }
  return residues;
}

module.exports = getResiduesInfo;
