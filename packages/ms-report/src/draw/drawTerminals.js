'use strict';

const drawLabel = require('./drawLabel');

function drawTerminals(paper, row, options) {
  for (let residue of row.residues) {
    if (!residue.results) continue;
    for (let result of residue.results.begin) {
      let line = paper.line(
        residue.paper.xTo + options.spaceBetweenResidues / 2,
        residue.paper.y,
        residue.paper.xTo + options.spaceBetweenResidues / 2,
        residue.paper.y - 8,
      );
      line.stroke({
        color: result.color,
        width: options.strokeWidth,
        linecap: 'round',
      });
      line = paper.line(
        residue.paper.xTo + options.spaceBetweenResidues / 2,
        residue.paper.y,
        residue.paper.xTo + options.spaceBetweenResidues / 2 - 5,
        residue.paper.y + 5,
      );
      line.stroke({
        color: result.color,
        width: options.strokeWidth,
        linecap: 'round',
      });
      drawLabel(
        paper,
        result,
        residue.paper.xTo + options.spaceBetweenResidues / 2,
        residue.paper.y +
          options.labelSize +
          6 +
          residue.paper.bottomPosition * options.labelSize,
        options,
      );
      residue.paper.bottomPosition++;
    }
    for (let result of residue.results.end) {
      let line = paper.line(
        residue.paper.xTo +
          options.spaceBetweenResidues / 2 +
          options.strokeWidth,
        residue.paper.y,
        residue.paper.xTo +
          options.spaceBetweenResidues / 2 +
          options.strokeWidth,
        residue.paper.y - 8,
      );
      line.stroke({
        color: result.color,
        width: options.strokeWidth,
        linecap: 'round',
      });
      line = paper.line(
        residue.paper.xTo +
          options.spaceBetweenResidues / 2 +
          options.strokeWidth,
        residue.paper.y - 8,
        residue.paper.xTo +
          options.spaceBetweenResidues / 2 +
          5 +
          options.strokeWidth,
        residue.paper.y - 13,
      );
      line.stroke({
        color: result.color,
        width: options.strokeWidth,
        linecap: 'round',
      });
      drawLabel(
        paper,
        result,
        residue.paper.xTo + options.spaceBetweenResidues,
        residue.paper.y - 17 - residue.paper.topPosition * options.labelSize,
        options,
      );
      residue.paper.topPosition++;
    }
  }
}

module.exports = drawTerminals;
