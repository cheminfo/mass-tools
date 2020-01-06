'use strict';

const appendResiduesPosition = require('./appendResiduesPosition');
const sequenceParser = require('./sequenceParser');
const improveResults = require('./improveResults');
const getRowHeight = require('./getRowHeight');
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
  } = options;

  let parsedSequence = sequenceParser(sequence, parsing);

  appendResiduesPosition(parsedSequence, {
    leftRightBorders,
    spaceBetweenResidues,
    labelFontFamily,
    labelSize,
    width,
  });

  let results = improveResults(analysisResult, parsedSequence.residues.length);

  let rowHeight = getRowHeight(results, parsedSequence.all, {
    verticalShiftForTerminalAnnotations,
    spaceBetweenInternalLines,
  });

  // We start to create the SVG and create the paper
  const paper = getPaper();

  addScript(paper);

  parsedSequence.all.forEach(function(residue) {
    residue.paper.y = (residue.paper.line + 1) * rowHeight;
    let text = paper.plain(residue.label);
    text.font({
      family: labelFontFamily,
      size: 12,
      weight: 'bold',
      fill: residue.replaced ? 'darkviolet' : '#888',
    });
    text.attr({
      x: residue.paper.xFrom,
      y: residue.paper.y,
    });
    text.attr({ id: `residue-${residue.fromBegin}` });
  });

  drawInternals();
  drawTerminals();
  let height = drawReplacements();

  paper.size(width, height);

  let svg = paper.svg();

  paper.clear();
  return svg;

  function drawTerminals() {
    for (let result of results) {
      if (result.internal) continue;

      let residue = parsedSequence.residues[result.position];

      if (residue) {
        let line = paper.line(
          residue.paper.xTo + spaceBetweenResidues / 2,
          residue.paper.y,
          residue.paper.xTo + spaceBetweenResidues / 2,
          residue.paper.y - 8,
        );
        line.stroke({
          color: result.color,
          width: strokeWidth,
          linecap: 'round',
        });
        if (result.fromBegin) {
          line = paper.line(
            residue.paper.xTo + spaceBetweenResidues / 2,
            residue.paper.y,
            residue.paper.xTo + spaceBetweenResidues / 2 - 5,
            residue.paper.y + 5,
          );
          line.stroke({
            color: result.color,
            width: strokeWidth,
            linecap: 'round',
          });
          drawLabel(
            result,
            residue.paper.xTo + spaceBetweenResidues / 2,
            residue.paper.y + 12 + residue.paper.bottomPosition * labelSize,
          );
          residue.paper.bottomPosition++;
        } else {
          line = paper.line(
            residue.paper.xTo + spaceBetweenResidues / 2,
            residue.paper.y - 8,
            residue.paper.xTo + spaceBetweenResidues / 2 + 5,
            residue.paper.y - 13,
          );
          line.stroke({
            color: result.color,
            width: strokeWidth,
            linecap: 'round',
          });
          drawLabel(
            result,
            residue.paper.xTo + spaceBetweenResidues,
            residue.paper.y - 15 - residue.paper.topPosition * labelSize,
          );
          residue.paper.topPosition++;
        }
      }
    }
  }

  function drawLabel(result, x, y) {
    let label = result.type;
    let similarity = String(Math.round(result.similarity));
    let charge = result.charge > 0 ? `+${result.charge}` : result.charge;
    let text = paper.plain(label);
    text.font({
      fill: result.textColor,
      family: labelFontFamily,
      weight: 'bold',
      size: labelSize,
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
      family: labelFontFamily,
      size: labelSize / 2,
    });
    text.attr({ x: x + textWidth, y: y - labelSize / 2 });
    text = paper.plain(similarity);
    text.font({
      fill: result.textColor,
      family: labelFontFamily,
      size: labelSize / 2,
    });
    text.attr({ x: x + textWidth, y });
  }

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
        drawLabel(result, (fromX + toX) / 2 - 10, y - 2);

        // label = result.type + ' (' + Math.round(result.similarity) + '%)';
      }
    }
  }

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

module.exports = sequenceSVG;

function addScript(paper) {
  let scriptCode = ` // <![CDATA[
      function mouseOver(evt) {
          let targetRange=evt.target.id.replace(/^line/,'');
          let from=targetRange.replace(/-.*/,'')*1;
          let to=targetRange.replace(/.*-/,'')*1;
          let children=evt.target.parentNode.children;
          for (let child of children) {
              if (child.nodeName === 'text' && child.id.startsWith("residue")) {
                  let residueNumber=child.id.replace(/residue-/,'')*1;
                  if (residueNumber>=from && residueNumber<=to) {
                      child.setAttribute('fill','red');
                  }
              }
          }
      }
      function mouseOut(evt) {
          let children=evt.target.parentNode.children;
          for (let child of children) {
              if (child.nodeName === 'text' && child.id.startsWith("residue")) {
                  child.setAttribute('fill','black');
              }
          }
      }
   // ]]>
  `;
  let script = paper.element('script');
  script.attr({
    type: 'application/ecmascript',
  });
  script.words(scriptCode);
}
