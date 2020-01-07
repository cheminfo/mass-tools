'use strict';

function drawReplacements(paper, data, options) {
  let replacements = data.residues.replacements;
  replacements = Object.keys(replacements).map((key) => {
    return { key, ...replacements[key] };
  });

  for (let replacement of replacements) {
    options.verticalPosition += options.spaceBetweenInternalLines;
    let text = paper.plain(`${replacement.label} = ${replacement.key}`);
    text.font({
      fill: 'darkviolet',
      family: options.labelFontFamily,
      weight: 'bold',
      size: 10,
    });
    text.attr({
      x: options.leftRightBorders,
      y: options.verticalPosition,
    });
  }
  options.verticalPosition += options.spaceBetweenInternalLines;
}

module.exports = drawReplacements;
