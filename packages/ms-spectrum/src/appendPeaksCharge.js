'use strict';

/**
 * @param {object}   [options={}]
 * @param {object}   [options.min=1]
 * @param {object}   [options.max=10]
 * @param {object}   [options.low=-1]
 * @param {object}   [options.high=1]
 * @param {object}   [options.precision=100]
 */

const NEUTRON_MASS = 1;

function appendPeaksCharge(peaks, options = {}) {
  let {
    precision = 100,
    low = -1,
    high = 1,
    min: minCharge = 1,
    max: maxCharge = 10
  } = options;
  let fromCharge =
    minCharge * maxCharge > 0
      ? Math.round(Math.min(Math.abs(minCharge), Math.abs(maxCharge)))
      : 1;
  let toCharge = Math.round(Math.max(Math.abs(minCharge), Math.abs(maxCharge)));

  let fromIsotope = Math.ceil(low);
  let toIsotope = Math.floor(high);
  let numberIsotopes = toIsotope - fromIsotope + 1;
  let isotopeIntensity = 1 / numberIsotopes;
  let fromIndex = 0;
  let localFromIndex = 0;
  let localToIndex = 0;
  for (let peakIndex = 0; peakIndex < peaks.length; peakIndex++) {
    let peak = peaks[peakIndex];

    let targetMass = peak.x;
    localFromIndex = fromIndex;
    let bestCharge = fromCharge;
    let bestChargeMatch = 0;
    for (let charge = fromCharge; charge < toCharge + 1; charge++) {
      let theoreticalPositions = {
        x: [],
        y: new Array(numberIsotopes).fill(isotopeIntensity)
      };

      let massRange = precision * 1e-6 * targetMass;
      for (
        let isotopePosition = fromIsotope;
        isotopePosition < toIsotope + 1;
        isotopePosition++
      ) {
        theoreticalPositions.x.push(
          targetMass + (isotopePosition * NEUTRON_MASS) / charge
        );
      }
      let fromMass = targetMass + low / Math.abs(charge) - massRange;
      let toMass = targetMass + high / Math.abs(charge) + massRange;

      if (charge === 1) {
        // we may move the fromIndex
        while (peaks[fromIndex].x < fromMass) {
          fromIndex++;
        }
      }

      /*
       * Find the from / to index for the specific peak and specific charge
       */
      while (peaks[localFromIndex].x < fromMass) {
        localFromIndex++;
      }
      localToIndex = localFromIndex;
      let localHeightSum = 0;
      while (localToIndex < peaks.length && peaks[localToIndex].x < toMass) {
        localHeightSum += peaks[localToIndex].y;
        localToIndex++;
      }
      localToIndex--;

      //  console.log({ localFromIndex, localToIndex });
      /*
        Calculate the overlap for a specific peak and specific charge
      */
      let currentTheoreticalPosition = 0;
      let theoreticalMaxValue = 1 / numberIsotopes;
      let totalMatch = 0;

      for (let index = localFromIndex; index <= localToIndex; index++) {
        let minMass =
          theoreticalPositions.x[currentTheoreticalPosition] -
          massRange / charge;
        let maxMass =
          theoreticalPositions.x[currentTheoreticalPosition] +
          massRange / charge;

        while (maxMass < peaks[index].x) {
          currentTheoreticalPosition++;
          theoreticalMaxValue = 1 / numberIsotopes;
          minMass =
            theoreticalPositions.x[currentTheoreticalPosition] -
            massRange / charge;
          maxMass =
            theoreticalPositions.x[currentTheoreticalPosition] +
            massRange / charge;
        }

        while (index < peaks.length && peaks[index].x < minMass) {
          index++;
        }

        //    console.log({ index, minMass, maxMass, massRange, localHeightSum });
        if (index < peaks.length && peaks[index].x <= maxMass) {
          while (index < peaks.length && peaks[index].x <= maxMass) {
            if (peaks[index].x >= minMass && peaks[index].x <= maxMass) {
              let value = peaks[index].y / localHeightSum;
              //      console.log({ theoreticalMaxValue, value });
              value = Math.min(theoreticalMaxValue, value);

              theoreticalMaxValue -= value;
              totalMatch += value;
            }
            index++;
          }
          index--;
        }

        if (totalMatch > bestChargeMatch) {
          bestCharge = charge;
          bestChargeMatch = totalMatch;
        }
      }
    }
    peak.charge = bestCharge;
  }
  return peaks;
}

module.exports = appendPeaksCharge;
