'use strict';

function addCSS(paper) {
  let cssCode = `
    .highlight {
        stroke: yellow;
        stroke-width: 5px;
    }
    `;
  let style = paper.element('style');
  style.words(cssCode);
}

module.exports = addCSS;
