'use strict';

const appendResiduesPosition = require('./appendResiduesPosition');
const appendResidues = require('./appendResidues');
const appendResults = require('./appendResults');
const appendRowsInformation = require('./appendRowsInformation');
const appendRows = require('./appendRows');
const appendInternals = require('./appendInternals');
const addScript = require('./draw/addScript');
const addCSS = require('./draw/addCSS');
const drawInternals = require('./draw/drawInternals');
const drawSequence = require('./draw/drawSequence');
const drawReplacements = require('./draw/drawReplacements');
const getPaper = require('./getPaper');

function sequenceSVG(sequence, analysisResult, options = {}) {
  const {
    width = 600,
    leftRightBorders = 50,
    spaceBetweenResidues = 30,
    spaceBetweenInternalLines = 12,
    strokeWidth = 2,
    labelFontFamily = 'Verdana',
    labelSize = 8,
    parsing,
    merge,
  } = options;

  const drawOptions = {
    spaceBetweenResidues,
    leftRightBorders,
    spaceBetweenInternalLines,
    strokeWidth,
    labelSize,
    labelFontFamily,
    verticalPosition: spaceBetweenInternalLines,
    width,
  };

  let data = {};
  appendResidues(data, sequence, parsing);
  appendResults(data, analysisResult, {
    merge,
  });
  appendResiduesPosition(data, {
    leftRightBorders,
    spaceBetweenResidues,
    labelFontFamily,
    labelSize,
    width,
  });
  appendRows(data);
  appendInternals(data);
  appendRowsInformation(data);

  // We start to create the SVG and create the paper
  const paper = getPaper();
  addCSS(paper);
  addScript(paper);

  for (let row of data.rows) {
    drawInternals(paper, row, drawOptions);
    drawSequence(paper, row, drawOptions);
  }
  drawReplacements(paper, data, drawOptions);

  paper.size(width, drawOptions.verticalPosition);

  let svg = paper.svg();
  paper.clear();
  return svg;
}

module.exports = sequenceSVG;
