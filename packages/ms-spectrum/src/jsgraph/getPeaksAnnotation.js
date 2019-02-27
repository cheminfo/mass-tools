'use strict';

const emdb = require('emdb');

function getPeaksAnnotation(bestPeaks, options = {}) {
  const {
    numberDigits = 5,
    shift = 0,
    showMF = false,
    ranges = 'C0-30 H0-60 N0-5 O0-10 F0-3 Cl0-3',
    precision = 100
  } = options;
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
            text: (peak.x + shift).toFixed(numberDigits),
            position: {
              x: peak.x,
              y: peak.y,
              dy: '-17px',
              dx: '2px'
            }
          }
        ]
      };
      if (showMF) {
        // currently we only deal with difference, when shift is not equal to zero
        // it is expected to be a neutral loss
        emdb.fromMonoisotopicMass(Math.abs(peak.x + shift), {
          ranges,
          limit: 20,
          precision,
          allowNeutral: true
        });
      }
    }

    annotations.push(annotation);
  }
  return annotations;
}

module.exports = getPeaksAnnotation;
