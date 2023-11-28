import { drawTerminals } from './drawTerminals';

export function drawSequence(paper, row, options) {
  // need to plan some space for the OVER
  options.verticalPosition += row.info.nbOver * (options.labelSize + 1);

  for (const residue of row.residues) {
    residue.paper.y = options.verticalPosition;

    let text = paper.plain(residue.label);

    let textColor = residue.replaced
      ? 'darkviolet'
      : residue.kind === 'residue'
        ? '#555'
        : '#CCC';

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

  drawTerminals(paper, row, options);

  // need to plan some space for the UNDER
  options.verticalPosition += row.info.nbUnder * (options.labelSize + 1);

  options.verticalPosition += options.spaceBetweenInternalLines * 2;
}
