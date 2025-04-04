import { fromMonoisotopicMass } from '../from/fromMonoisotopicMass';

/**
 *
 * @param {array} bestPeaks
 * @param {object} [options={}]
 * @param {number} [options.numberDigits=5]
 * @param {number} [options.numberMFs=0]
 * @param {boolean} [options.showMF=false]
 * @param {array} [options.mfColors={}]
 * @param {number} [options.charge=1]
 * @param {number} [options.shift=0]
 * @param {object} [options.mfPrefs]
 * @param {number} [options.displayCharge=true]
 * @param {number} [options.displayProperties=[]] Array of properties name to display
 * @returns {Promise}
 */
export async function getPeaksAnnotation(bestPeaks, options = {}) {
  let {
    numberDigits = 5,
    shift = 0,
    showMF = false,
    numberMFs = 0,
    charge = 1,
    mfPrefs = {},
    displayCharge = true,
    displayProperties = [],
    mfColors = [
      { limit: 3, color: 'green' },
      { limit: 20, color: 'lightgreen' },
      { limit: 50, color: 'lightorange' },
    ],
  } = options;
  if (showMF && !numberMFs) numberMFs = 1;
  let annotations = [];
  bestPeaks.sort((a, b) => (a.close ? -1 : b.close ? 1 : 0));

  for (let peak of bestPeaks) {
    let textLine = 0;
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
            x: peak.x,
          },
          {
            y: peak.y,
            dy: '-15px',
            x: peak.x,
          },
        ],
      };
      annotations.push(annotation);
      annotation = {
        type: 'ellipse',
        _highlight: peak._highlight,
        info: peak,
        position: [
          {
            y: peak.y,
            dy: '-15px',
            x: peak.x,
          },
        ],
        props: {
          rx: '3px',
          ry: '3px',
          fillOpacity: 0.3,
        },
      };
    } else {
      annotation = {
        type: 'line',
        _highlight: peak._highlight,
        position: [
          {
            y: peak.y,
            dy: '-5px',
            x: peak.x,
          },
          {
            y: peak.y,
            dy: '-25px',
            x: peak.x,
          },
        ],
        labels: [
          {
            text: (peak.x + shift).toFixed(numberDigits),
            color: 'red',
            position: {
              x: peak.x,
              y: peak.y,
              dy: `${textLine++ * -13 - 17}px`,
              dx: '2px',
            },
          },
        ],
      };

      if (displayCharge && peak.charge !== undefined) {
        annotation.labels.push({
          text: `Z:${peak.charge}`,
          color: 'grey',
          position: {
            x: peak.x,
            y: peak.y,
            dy: '-4px',
            dx: '2px',
          },
        });
      }

      let mfs = [];

      if (numberMFs) {
        // we have 2 cases. Either there is a shift and we deal with differences
        // otherwise it is absolute
        // if there is a shift we consider only a neutral loss and the parameter charge is important
        // we also check that the selected peak (for relative mass) is not the current peak
        if (shift && Math.abs(peak.x + shift) > Number.EPSILON) {
          // neutral loss
          let currentMfPrefs = {
            ...mfPrefs,
            allowNeutral: true,
            ionizations: '',
          };
          // we need to deal with the precision and increase it
          currentMfPrefs.precision =
            (currentMfPrefs.precision / Math.max(Math.abs(peak.x + shift), 1)) *
            peak.x;
          ({ mfs } = await fromMonoisotopicMass(
            Math.abs((peak.x + shift) * charge),
            currentMfPrefs,
          ));
        } else {
          ({ mfs } = await fromMonoisotopicMass(
            Math.abs(peak.x * charge),
            mfPrefs,
          ));
        }

        let numberOfMFS = Math.min(mfs.length, numberMFs);

        for (let i = 0; i < numberOfMFS; i++) {
          let mf = mfs[i];

          let ppm = shift ? (mf.ms.ppm / shift) * mfs[0].ms.em : mf.ms.ppm;
          annotation.labels.push({
            text: mf.mf,
            color: getColor(mfColors, Math.abs(ppm)),
            position: {
              x: peak.x,
              y: peak.y,
              dy: `${textLine++ * -13 - 17}px`,
              dx: '2px',
            },
          });
        }
      }

      if (displayProperties.length > 0) {
        for (let property of displayProperties) {
          annotation.labels.push({
            text: peak[property],
            color: 'red',
            position: {
              x: peak.x,
              y: peak.y,
              dy: `${textLine++ * -13 - 17}px`,
              dx: '2px',
            },
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
