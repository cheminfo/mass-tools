import { appendInternals } from './appendInternals';
import { appendResidues } from './appendResidues';
import { appendResiduesPosition } from './appendResiduesPosition';
import { appendResults } from './appendResults';
import { appendRows } from './appendRows';
import { appendRowsInformation } from './appendRowsInformation';
import { addCSS } from './draw/addCSS';
import { addScript } from './draw/addScript';
import { drawInternals } from './draw/drawInternals';
import { drawReplacements } from './draw/drawReplacements';
import { drawSequence } from './draw/drawSequence';
import { getPaper } from './getPaper';

/**
 *
 * @param {string} sequence
 * @param {array} analysisResults
 * @param {object} [options={}]
 * @param {number} [options.leftRightBorders=50]
 * @param {number} [options.width=600]
 * @param {number} [options.spaceBetweenResidues=30]
 * @param {number} [options.spaceBetweenInternalLines=12]
 * @param {number} [options.strokeWidth=2]
 * @param {string} [options.labelFontFamily='Verdana']
 * @param {number} [options.labelSize=8]
 * @param {number} [options.parsing] Sequence parsing options
 * @param {object} [options.merge={}]
 * @param {boolean} [options.merge.charge] Merge results if only differs by charge
 * @param {object} [options.filter={}] define some filters
 * @param {number} [options.filter.minSimilarity=0]  minimal similarity
 * @param {number} [options.filter.minQuantity=0]  minimal quantity
 * @param {number} [options.filter.minRelativeQuantity=0]  minimal relative quantity. This value should be between 0 and 1 and supersede minQuantity.
 * @param {boolean} [options.filter.showInternals=true] show the internal fragments
 *
 */
export function sequenceSVG(sequence, analysisResults, options = {}) {
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
    filter,
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
  appendResults(data, analysisResults, {
    merge,
    filter,
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
