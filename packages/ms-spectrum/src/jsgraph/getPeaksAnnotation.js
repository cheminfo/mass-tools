'use strict';

function getPeaksAnnotation(bestPeaks) {
  let annotations = [];
  for (let peak of bestPeaks) {
    let annotation;
    if (peak.close) {
      annotation = {
        type: 'line',
        _highlight: peak._highlight,
        info: peak,
        position: [
          {
            y: peak.y,
            dy: '-5px',
            x: peak.x
          },
          {
            y: peak.y,
            dy: '-10px',
            x: peak.x
          }
        ]
      };
    } else {
      annotation = {
        type: 'line',
        _highlight: peak._highlight,
        position: [
          {
            y: peak.y,
            dy: '-5px',
            x: peak.x
          },
          {
            y: peak.y,
            dy: '-25px',
            x: peak.x
          }
        ],
        labels: [
          {
            text: peak.x.toFixed(5),
            position: {
              x: peak.x,
              y: peak.y,
              dy: '-17px',
              dx: '2px'
            }
          }
        ]
      };
    }

    annotations.push(annotation);
  }
  return annotations;
}

module.exports = getPeaksAnnotation;
