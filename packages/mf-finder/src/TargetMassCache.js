import { ELECTRON_MASS } from 'chemical-elements';

/**
 * returns all the possible neutral mass for a defined experimental (targetMass) mass
 */

export function TargetMassCache(targetMass, possibilities, options = {}) {
  const {
    allowNeutral = false, // msem because em in this case !
    minCharge = Number.MIN_SAFE_INTEGER,
    maxCharge = Number.MAX_SAFE_INTEGER,
    charge = 0,
    precision = 100,
  } = options;
  if (!possibilities || possibilities.length === 0) return {};

  let firstPossibility = possibilities[0];
  let currentMinCharge = Math.max(
    minCharge,
    firstPossibility.minCharge + charge,
  );
  let currentMaxCharge = Math.min(
    maxCharge,
    firstPossibility.maxCharge + charge,
  );

  this.minCharge = currentMinCharge;
  this.maxCharge = currentMaxCharge;

  let size = this.maxCharge - this.minCharge + 1;
  this.data = [];
  let minMass = 0;
  let maxMass = 0;
  let range = (targetMass * precision) / 1e6;
  for (let i = 0; i < size; i++) {
    let currentCharge = i + this.minCharge;
    if (currentCharge === 0) {
      if (allowNeutral) {
        minMass = targetMass - range;
        maxMass = targetMass + range;
      } else {
        minMass = Number.MAX_SAFE_INTEGER;
        maxMass = Number.MIN_SAFE_INTEGER;
      }
    } else {
      minMass =
        (targetMass - range) * Math.abs(currentCharge) +
        ELECTRON_MASS * currentCharge;
      maxMass =
        (targetMass + range) * Math.abs(currentCharge) +
        ELECTRON_MASS * currentCharge;
    }

    this.data.push({
      charge: currentCharge,
      minMass,
      maxMass,
    });
  }
}

module.exports = TargetMassCache;

TargetMassCache.prototype.getMinMass = function getMinMass(charge) {
  return this.data[charge - this.minCharge]
    ? this.data[charge - this.minCharge].minMass
    : Number.MAX_SAFE_INTEGER;
};

TargetMassCache.prototype.getMaxMass = function getMaxMass(charge) {
  return this.data[charge - this.minCharge]
    ? this.data[charge - this.minCharge].maxMass
    : Number.MIN_SAFE_INTEGER;
};
