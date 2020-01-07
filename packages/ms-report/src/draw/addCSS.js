'use strict';

function addCSS(paper) {
  let cssCode = `
    .highlight {
        stroke: yellow;
        stroke-width: 5px;
        fill: red;
    }
    .highlightText {
        fill: red;
    }
    `;
  let style = paper.element('style');
  style.words(cssCode);
}

module.exports = addCSS;
