export function drawLabel(paper, result, x, y, options) {
  let label = result.type;
  let similarity = String(Math.round(result.similarity * 100));
  let charge = result.charge > 0 ? `+${result.charge}` : result.charge;
  let text = paper.plain(label);
  text.font({
    fill: result.textColor,
    family: options.labelFontFamily,
    weight: 'bold',
    size: options.labelSize,
    anchor: 'end',
  });
  text.attr({
    x,
    y,
  });
  let textWidth = 0;
  text = paper.plain(charge);
  text.font({
    fill: result.textColor,
    family: options.labelFontFamily,
    size: options.labelSize / 2,
  });
  text.attr({ x: x + textWidth, y: y - options.labelSize / 2 });
  text = paper.plain(similarity);
  text.font({
    fill: result.textColor,
    family: options.labelFontFamily,
    size: options.labelSize / 2,
  });
  text.attr({ x: x + textWidth, y });
}
