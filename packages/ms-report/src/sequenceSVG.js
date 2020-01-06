'use strict';

const appendResiduesPosition = require('./appendResiduesPosition');
const appendResidues = require('./appendResidues');
const appendResults = require('./appendResults');
const appendRowsInformation = require('./appendRowsInformation');
const appendRows = require('./appendRows');
const appendInternals = require('./appendInternals');
const addScript = require('./draw/addScript');
const drawSequence = require('./draw/drawSequence');
const getPaper = require('./getPaper');

function sequenceSVG(sequence, analysisResult, options = {}) {
  const {
    width = 600,
    leftRightBorders = 20,
    spaceBetweenResidues = 20,
    spaceBetweenInternalLines = 12,
    strokeWidth = 2,
    labelFontFamily = 'Verdana',
    labelSize = 8,
    verticalShiftForTerminalAnnotations = 20,
    parsing,
    merge,
  } = options;

  const drawOptions = {
    spaceBetweenResidues,
    spaceBetweenInternalLines,
    strokeWidth,
    labelSize,
    labelFontFamily,
    verticalPosition: spaceBetweenInternalLines,
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

  addScript(paper);

  for (let row of data.rows) {
    //  drawInternals(paper, row, drawOptions);
    //  drawOver(paper, row, drawOptions);
    drawSequence(paper, row, drawOptions);
    //  drawUnder(paper, row, drawOptions);
  }
  // drawReplacements(paper, row, drawOptions);

  paper.size(width, drawOptions.verticalPosition);

  let svg = paper.svg();
  paper.clear();
  return svg;
}

module.exports = sequenceSVG;
