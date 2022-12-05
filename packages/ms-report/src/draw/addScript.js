export function addScript(paper) {
  let scriptCode = ` // <![CDATA[
        function mouseOver(evt) {
           
            let targetRange=evt.target.id.replace(/^line/,'');
            let from=targetRange.replace(/-.*/,'')*1;
            let to=targetRange.replace(/.*-/,'')*1;
            let children=evt.target.parentNode.children;
            for (let child of children) {
                if (child.id === evt.target.id) {
                    child.setAttribute('class','highlight');
                }
                if (child.nodeName === 'text' && child.id.startsWith("residue")) {
                    let residueNumber=child.id.replace(/residue-/,'')*1;
                    if (residueNumber>=from && residueNumber<=to) {
                        child.setAttribute('class','highlightText');
                    }
                }
            }
        }
        function mouseOut(evt) {
            let children=evt.target.parentNode.children;
            for (let child of children) {
                if (child.id === evt.target.id) {
                    child.setAttribute('class','');
                }
                if (child.nodeName === 'text' && child.id.startsWith("residue")) {
                    child.setAttribute('class','');
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
