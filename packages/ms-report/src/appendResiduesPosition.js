'use strict';

const getPaper = require('./getPaper');

function appendResiduesPosition(data, options = {}) {
  const residues = data.residues;
  const {
    leftRightBorders = 20,
    spaceBetweenResidues = 20,
    width = 600,
  } = options;

  let xPos = leftRightBorders;
  let xOld = xPos;

  let line = 0;
  // we create a temporary paper in order to get the width of the text blocs

  const paper = getPaper();

  for (let i = 0; i < residues.all.length; i++) {
    let residue = residues.all[i];
    let textWidth = getTextWidth(paper, residue.label, options);
    xPos += textWidth;
    if (xPos > width - leftRightBorders) {
      xOld = leftRightBorders;
      xPos = leftRightBorders + textWidth;
      line++;
    }
    setPaper(residue, xOld, xPos, line);
    xPos += spaceBetweenResidues;
    xOld = xPos;
  }

  residues.nbLines = line;
}

function setPaper(residue, xFrom, xTo, line) {
  residue.paper = {
    xFrom,
    xTo,
    line,
    usedSlots: [],
    topPosition: 0,
    bottomPosition: 0,
  };
}

function getTextWidth(paper, label, options = {}) {
  const { labelFontFamily = 'Verdana', labelSize = 12 } = options;
  let text = paper.text(label);
  text.font({
    family: labelFontFamily,
    size: labelSize,
    weight: 'bold',
    fill: '#888',
  });
  let textWidth = text.length() || text.bbox().width;
  text.remove();
  return textWidth;
}

module.exports = appendResiduesPosition;
