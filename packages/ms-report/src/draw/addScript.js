'use strict';

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

module.exports = addScript;
