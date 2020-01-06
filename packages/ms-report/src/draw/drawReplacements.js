
  function drawReplacements() {
    let replacements = Object.keys(parsedSequence.replacements).map((key) => {
      return { key, ...parsedSequence.replacements[key] };
    });
    let y = (parsedSequence.nbLines + 1) * rowHeight + 50;
    for (let i = 0; i < replacements.length; i++) {
      const replacement = replacements[i];
      let text = paper.plain(`${replacement.label} = ${replacement.key}`);
      text.font({
        fill: 'darkviolet',
        family: labelFontFamily,
        weight: 'bold',
        size: 10,
      });
      text.attr({
        x: leftRightBorders,
        y,
      });
      y += 16;
    }
    return y;
  }
}

module.exports=drawReplacements