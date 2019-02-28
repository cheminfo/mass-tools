'use strict';

/**
 *
 * @param {array} bestPeaks
 * @param {object} [options={}]
 * @param {array} [options.mfColors={}]
 * @param {number} [options.numberDigits=5]
 * @param {boolean} [options.showMF=false]
 * @param {array} [options.mfColors={}]
 * @param {number} [options.charge=1]
 * @param {number} [options.shift=0]
 * @param {object} [options.mfPrefs]
 */

function getPeaksAnnotation(bestPeaks, options = {}) {
  const emdb = new (require('emdb'))();

  options = Object.assign({ limit: 5, precision: 100 }, options);

  let {
    numberDigits = 5,
    shift = 0,
    showMF = false,
    charge = 1,
    mfPrefs = {},
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
        // we have 2 cases. Either there is a shift and we deal with differences
        // otherwise it is absolute
        // if there is a shift we consider only a neutral loss and the parameter charge is important
        if (shift) {
          // neutral loss
          mfPrefs = Object.assign(mfPrefs, {
            allowNeutral: true,
            ionizations: ''
          });
          emdb.fromMonoisotopicMass(
            Math.abs((peak.x + shift) * charge),
            mfPrefs
          );
        } else {
          emdb.fromMonoisotopicMass(
            Math.abs((peak.x + shift) * charge),
            mfPrefs
          );
        }

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
