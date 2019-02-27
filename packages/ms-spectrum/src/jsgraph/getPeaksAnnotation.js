'use strict';

function getPeaksAnnotation(bestPeaks, options = {}) {
  const emdb = new (require('emdb'))();
  const {
    numberDigits = 5,
    shift = 0,
    showMF = false,
    ranges = 'C0-30 H0-60 N0-5 O0-10 F0-3 Cl0-3',
    precision = 100,
    charge = 1,
    mfColors = [
      { limit: 3, color: 'green' },
      { limit: 20, color: 'lightgreen' },
      { limit: 50, color: 'lightorange' }
    ]
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
            color: 'red',
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

        emdb.fromMonoisotopicMass(Math.abs((peak.x + shift) * charge), {
          ranges,
          limit: 20,
          precision,
          allowNeutral: true
        });
        let mfs = emdb.get('monoisotopic');

        if (mfs.length > 0) {
          annotation.labels.push({
            text: mfs[0].mf,
            color: getColor(mfColors, mfs[0].ms.ppm),
            position: {
              x: peak.x,
              y: peak.y,
              dy: '-30px',
              dx: '2px'
            }
          });
        }
      }
    }
    annotations.push(annotation);
  }
  return annotations;
}

function getColor(colors, value) {
  for (let color of colors) {
    if (value < color.limit) return color.color;
  }
  return 'lightgrey';
}

module.exports = getPeaksAnnotation;
