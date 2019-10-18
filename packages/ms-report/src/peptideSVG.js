'use strict';

const window = require('svgdom');

const document = window.document;
const { SVG, registerWindow } = require('@svgdotjs/svg.js');

const getResiduesInfo = require('./getResiduesInfo');
const improveResults = require('./improveResults');
const getRowHeight = require('./getRowHeight');

registerWindow(window, document);

function peptideSVG(sequence, analysisResult, options = {}) {
  const {
    width = 600,
    leftRightBorders = 20,
    spaceBetweenResidues = 20,
    spaceBetweenInternalLines = 10,
    strokeWidth = 2,
    labelFontFamily = 'Verdana',
    labelSize = 8,
    verticalShiftForTerminalAnnotations = 20,
  } = options;

  let residues = getResiduesInfo(sequence, {
    leftRightBorders,
    spaceBetweenResidues,
    labelFontFamily,
    width,
  });

  let results = improveResults(analysisResult, residues);

  let rowHeight = getRowHeight(results, residues, {
    verticalShiftForTerminalAnnotations,
    spaceBetweenInternalLines,
  });

  // We start to create the SVG and create the paper
  const paper = SVG(document.documentElement);

  addScript(paper);

  residues.forEach(function(residue) {
    residue.y = (residue.line + 1) * rowHeight;
    let text = paper.plain(residue.label);
    text.font({
      family: labelFontFamily,
      size: 12,
      weight: 'bold',
      fill: '#888',
    });
    text.attr({
      x: residue.xFrom,
      y: residue.y,
    });
    text.attr({ id: `residue-${residue.nTer}` });
  });

  drawInternals();
  drawTerminals();

  let svg = paper
    .toString()
    .replace(/>/g, '>\r')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  paper.clear();
  return svg;

  function drawTerminals() {
    for (let result of results) {
      let residue;
      let nTerminal = false;
      if (result.fromNTerm) {
        residue = residues[result.to];
        nTerminal = true;
      }
      if (result.fromCTerm) {
        residue = residues[result.from];
      }
      if (residue) {
        let line = paper.line(
          residue.xTo + spaceBetweenResidues / 2,
          residue.y,
          residue.xTo + spaceBetweenResidues / 2,
          residue.y - 8,
        );
        line.stroke({
          color: result.color,
          width: strokeWidth,
          linecap: 'round',
        });
        if (nTerminal) {
          line = paper.line(
            residue.xTo + spaceBetweenResidues / 2,
            residue.y,
            residue.xTo + spaceBetweenResidues / 2 - 5,
            residue.y + 5,
          );
          line.stroke({
            color: result.color,
            width: strokeWidth,
            linecap: 'round',
          });
          drawLabel(
            result,
            residue.xTo + spaceBetweenResidues / 2,
            residue.y + 12 + residue.bottomPosition * labelSize,
          );
          residue.bottomPosition++;
        } else {
          line = paper.line(
            residue.xTo + spaceBetweenResidues / 2,
            residue.y - 8,
            residue.xTo + spaceBetweenResidues / 2 + 5,
            residue.y - 13,
          );
          line.stroke({
            color: result.color,
            width: strokeWidth,
            linecap: 'round',
          });
          drawLabel(
            result,
            residue.xTo + spaceBetweenResidues,
            residue.y - 15 - residue.topPosition * labelSize,
          );
          residue.topPosition++;
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
      if (result.internal) {
        let fromResidue = residues[result.from + 1];
        let toResidue = residues[result.to];
        // let charge = result.charge > 0 ? '+' + result.charge : result.charge;
        // let label = result.type + ' (' + charge + ', ' + Math.round(result.similarity) + '%)';
        // we need to check on how many lines we are
        let fromX, toX, y;
        for (let line = fromResidue.line; line <= toResidue.line; line++) {
          y =
            -10 -
            result.slot * spaceBetweenInternalLines +
            (line + 1) * rowHeight -
            verticalShiftForTerminalAnnotations;
          if (line === fromResidue.line) {
            fromX = fromResidue.xFrom - spaceBetweenResidues / 2;
          } else {
            fromX = 0;
          }
          if (line === toResidue.line) {
            toX = toResidue.xTo + spaceBetweenResidues / 2;
          } else {
            toX = width - 1;
          }
          let drawLine = paper.line(fromX, y, toX, y);
          drawLine.attr({
            onmouseover: 'mouseOver(evt)',
            onmouseout: 'mouseOut(evt)',
            id: `line${fromResidue.nTer}-${toResidue.nTer}`,
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
  }
}

module.exports = peptideSVG;

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
