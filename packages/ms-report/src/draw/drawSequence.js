'use strict';

const drawTerminals = require('./drawTerminals');

function drawSequence(paper, row, options) {
  // need to plan some space for the OVER
  for (const residue of row.residues) {
    residue.paper.y = options.verticalPosition;

    let text = paper.plain(residue.label);

    let textColor = residue.replaced
      ? 'darkviolet'
      : residue.kind === 'residue'
      ? '#888'
      : '#AAA';

    text.font({
      family: options.labelFontFamily,
      size: 12,
      weight: 'bold',
      fill: textColor,
    });
    text.attr({
      x: residue.paper.xFrom,
      y: residue.paper.y,
    });
    text.attr({ id: `residue-${residue.fromBegin}` });
  }

  // need to plan some space for the UNDER
  drawTerminals(paper, row, options);

  options.verticalPosition += options.spaceBetweenInternalLines;
}

module.exports = drawSequence;
