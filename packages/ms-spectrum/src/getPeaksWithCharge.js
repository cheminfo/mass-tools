// We can not really take the real value of the neutron because it varies from one element to another.
const NEUTRON_MASS = 1;

/**
 *
 * @param {Array} selectedPeaks
 * @param {Array} allPeaks
 * @param {object} [options={}]
 * @param {number} [options.min=1]
 * @param {number} [options.max=10]
 * @param {number} [options.low=-1]
 * @param {number} [options.high=1]
 * @param {number} [options.precision=30]
 * @returns
 */
export function getPeaksWithCharge(selectedPeaks, allPeaks, options = {}) {
  let {
    precision = 100,
    low = -1,
    high = 1,
    min: minCharge = 1,
    max: maxCharge = 10,
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
  const peaksWithCharge = [];
  for (const peak of selectedPeaks) {
    let targetMass = peak.x;
    localFromIndex = fromIndex;
    let bestCharge = fromCharge;
    let bestChargeMatch = 0;
    for (let charge = fromCharge; charge < toCharge + 1; charge++) {
      let theoreticalPositions = {
        x: [],
        y: new Array(numberIsotopes).fill(isotopeIntensity),
      };

      let massRange = precision * 1e-6 * targetMass;
      for (
        let isotopePosition = fromIsotope;
        isotopePosition < toIsotope + 1;
        isotopePosition++
      ) {
        theoreticalPositions.x.push(
          targetMass + (isotopePosition * NEUTRON_MASS) / charge,
        );
      }
      let fromMass = targetMass + low / Math.abs(charge) - massRange;
      let toMass = targetMass + high / Math.abs(charge) + massRange;

      if (charge === 1) {
        // we may move the fromIndex
        while (allPeaks[fromIndex].x < fromMass) {
          fromIndex++;
        }
      }

      /*
       * Find the from / to index for the specific peak and specific charge
       */
      while (allPeaks[localFromIndex].x < fromMass) {
        localFromIndex++;
      }
      localToIndex = localFromIndex;
      let localHeightSum = 0;
      while (
        localToIndex < allPeaks.length &&
        allPeaks[localToIndex].x < toMass
      ) {
        localHeightSum += allPeaks[localToIndex].y;
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

        while (maxMass < allPeaks[index].x) {
          currentTheoreticalPosition++;
          theoreticalMaxValue = 1 / numberIsotopes;
          minMass =
            theoreticalPositions.x[currentTheoreticalPosition] -
            massRange / charge;
          maxMass =
            theoreticalPositions.x[currentTheoreticalPosition] +
            massRange / charge;
        }

        while (index < allPeaks.length && allPeaks[index].x < minMass) {
          index++;
        }

        //    console.log({ index, minMass, maxMass, massRange, localHeightSum });
        if (index < allPeaks.length && allPeaks[index].x <= maxMass) {
          while (index < allPeaks.length && allPeaks[index].x <= maxMass) {
            if (allPeaks[index].x >= minMass && allPeaks[index].x <= maxMass) {
              let value = allPeaks[index].y / localHeightSum;
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
    peaksWithCharge.push({ ...peak, charge: bestCharge });
  }
  return peaksWithCharge;
}
