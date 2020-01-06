'use strict';

function drawInternals() {
  for (let result of results) {
    if (!result.internal) continue;
    let fromResidue = parsedSequence.residues[result.from + 1];
    let toResidue = parsedSequence.residues[result.to];
    // let charge = result.charge > 0 ? '+' + result.charge : result.charge;
    // let label = result.type + ' (' + charge + ', ' + Math.round(result.similarity) + '%)';
    // we need to check on how many lines we are
    let fromX, toX, y;
    for (
      let line = fromResidue.paper.line;
      line <= toResidue.paper.line;
      line++
    ) {
      y =
        -10 -
        result.slot * spaceBetweenInternalLines +
        (line + 1) * rowHeight -
        verticalShiftForTerminalAnnotations;
      if (line === fromResidue.paper.line) {
        fromX = fromResidue.paper.xFrom - spaceBetweenResidues / 2;
      } else {
        fromX = 0;
      }
      if (line === toResidue.paper.line) {
        toX = toResidue.paper.xTo + spaceBetweenResidues / 2;
      } else {
        toX = width - 1;
      }
      let drawLine = paper.line(fromX, y, toX, y);
      drawLine.attr({
        onmouseover: 'mouseOver(evt)',
        onmouseout: 'mouseOut(evt)',
        id: `line${fromResidue.fromBegin}-${toResidue.fromBegin}`,
      });
      drawLine.stroke({
        color: result.color,
        width: strokeWidth,
      });
      let center = (fromX + toX + (result.type.length * labelSize * 2) / 3) / 2;
      drawLabel(result, center, y - 2);
    }
  }
}

module.exports = drawInternals;
