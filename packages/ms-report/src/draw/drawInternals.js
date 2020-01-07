'use strict';

const drawLabel = require('./drawLabel');

function drawInternals(paper, row, options) {
  let fromX = 0;
  let toX = 0;
  for (const internal of row.internals.slice(0, 1)) {
    options.verticalPosition += options.spaceBetweenInternalLines;
    if (internal.firstIndex === true) {
      fromX = 0;
    } else {
      fromX =
        internal.fromResidue.paper.xFrom - options.spaceBetweenResidues / 2;
    }
    if (internal.lastIndex === true) {
      toX = options.width - 1;
    } else {
      toX = internal.toResidue.paper.xTo + options.spaceBetweenResidues / 2;
    }

    let y = options.verticalPosition;

    let drawLine = paper.line(fromX, y, toX, y);
    drawLine.attr({
      onmouseover: 'mouseOver(evt)',
      onmouseout: 'mouseOut(evt)',
      id: `line${internal.fromResidue.fromBegin}-${internal.toResidue.fromBegin}`,
    });
    drawLine.stroke({
      color: internal.color,
      width: options.strokeWidth,
    });

    let center =
      (fromX + toX + (internal.type.length * options.labelSize * 2) / 3) / 2;
    drawLabel(paper, internal, center, y - 2, options);
  }
  options.verticalPosition += options.spaceBetweenInternalLines * 2;
}

module.exports = drawInternals;
