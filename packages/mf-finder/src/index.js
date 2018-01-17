'use strict';

const preprocessRanges = require('./preprocessRanges');
const TargetMassCache = require('./TargetMassCache');
const ELECTRON_MASS = require('chemical-elements/src/constants').ELECTRON_MASS;
/**
 * Returns possible combinations
 *
 * ranges=[{
 * unaturation,
 * em,
 * min
 * max
 * }]
 *
 * @return {}
 */

let targetMassCache;

module.exports = function findMF(targetMass, options = {}) {
    const {
        minCharge = Number.MIN_SAFE_INTEGER,
        maxCharge = Number.MAX_SAFE_INTEGER,
        minUnsaturation = Number.MIN_SAFE_INTEGER,
        maxUnsaturation = Number.MAX_SAFE_INTEGER,
        onlyIntegerUnsaturation,
        onlyNonIntegerUnsaturation,
        maxIterations = 1e8,
        maxResults = 1e5,
        allowNeutral = false, // msem because em in this case !
        ranges = [
            { mf: 'C', min: 0, max: 100 },
            { mf: 'H', min: 0, max: 100 },
            { mf: 'O', min: 0, max: 100 },
            { mf: 'N', min: 0, max: 100 },
        ],
    } = options;

    let filterUnsaturation = (minUnsaturation !== Number.MIN_SAFE_INTEGER || maxUnsaturation !== Number.MAX_SAFE_INTEGER || onlyIntegerUnsaturation || onlyNonIntegerUnsaturation);
    // we calculate not the real unsaturation but the one before dividing by 2 + 1
    let fakeMinUnsaturation = (minUnsaturation === Number.MIN_SAFE_INTEGER) ? Number.MIN_SAFE_INTEGER : (minUnsaturation - 1) * 2;
    let fakeMaxUnsaturation = (maxUnsaturation === Number.MAX_SAFE_INTEGER) ? Number.MAX_SAFE_INTEGER : (maxUnsaturation - 1) * 2;

    let filterCharge = (minCharge !== Number.MIN_SAFE_INTEGER || maxCharge !== Number.MAX_SAFE_INTEGER);

    let result = {
        mfs: []
    };
    let possibilities = preprocessRanges(ranges);
    if (possibilities.length === 0) return { mfs: [] };

    targetMassCache = new TargetMassCache(targetMass, possibilities, options);
    let iterationNumber = 0;
    let numberResults = 0;


    result.info = {
        numberMFEvaluated: 0,
        numberResults: 0,
    };

    let theEnd = false;
    let maxPosition = possibilities.length;
    let lastPosition = possibilities.length - 1;
    let currentPosition = lastPosition;
    let currentAtom;
    let previousAtom;
    let lastPossibility = possibilities[lastPosition];
    setCurrentMinMax(lastPossibility);

    while (!theEnd) {
        if (result.info.numberMFEvaluated++ > maxIterations) {
            throw Error(`Iteration number is over the current maximum of: ${maxIterations}`);
        }
        //     console.log(possibilities.map((a) => a.currentCount));

        let isValid = true;
        if (filterUnsaturation) {
            let unsaturation = lastPossibility.currentUnsaturation;
            if (
                (onlyIntegerUnsaturation && unsaturation % 2 === 1) ||
                (onlyNonIntegerUnsaturation && unsaturation % 2 === 0) ||
                (fakeMinUnsaturation > unsaturation) ||
                (fakeMaxUnsaturation < unsaturation)
            ) isValid = false;
        }
        if (filterCharge && (lastPossibility.currentCharge < minCharge || lastPossibility.currentCharge > maxCharge)) {
            isValid = false;
        }
        if (isValid) {
            let minMass = targetMassCache.getMinMass(lastPossibility.currentCharge);
            let maxMass = targetMassCache.getMaxMass(lastPossibility.currentCharge);
            if ((lastPossibility.currentMonoisotopicMass < minMass) || (lastPossibility.currentMonoisotopicMass > maxMass)) {
                isValid = false;
            }
        }
        if (isValid) {
            result.mfs.push(getResult(possibilities, targetMass, allowNeutral));
            result.info.numberResults++;
        }


        // we need to setup all the arrays if possible
        while (currentPosition < maxPosition && currentPosition >= 0) {
            currentAtom = possibilities[currentPosition];
            previousAtom = (currentPosition === 0) ? undefined : possibilities[currentPosition - 1];
            if (currentAtom.currentCount < currentAtom.currentMaxCount) {
                currentAtom.currentCount++;
                if (currentPosition === 0) {
                    currentAtom.currentMonoisotopicMass = currentAtom.em * currentAtom.currentCount;
                    currentAtom.currentCharge = currentAtom.charge * currentAtom.currentCount;
                    currentAtom.currentUnsaturation = currentAtom.unsaturation * currentAtom.currentCount;
                } else {
                    currentAtom.currentMonoisotopicMass = previousAtom.currentMonoisotopicMass + currentAtom.em * currentAtom.currentCount;
                    currentAtom.currentCharge = previousAtom.currentCharge + currentAtom.charge * currentAtom.currentCount;
                    currentAtom.currentUnsaturation = previousAtom.currentUnsaturation + currentAtom.unsaturation * currentAtom.currentCount;
                }
                if (currentPosition < lastPosition) {
                    currentPosition++;
                    setCurrentMinMax(possibilities[currentPosition], possibilities[currentPosition - 1]);
                } else {
                    break;
                }
            } else {
                currentPosition--;
            }
        }
        if (currentPosition < 0) {
            theEnd = true;
        }


    }
    return result;
};

function getResult(possibilities, targetMass, allowNeutralMolecules) {
    let result = {
        em: 0,
        unsaturation: 0,
        mf: '',
        charge: 0,
        msem: 0
    };
    for (let possibility of possibilities) {
        if (possibility.currentCount != 0) {
            result.em += possibility.em * possibility.currentCount;
            result.charge += possibility.charge * possibility.currentCount;
            result.unsaturation += possibility.unsaturation * possibility.currentCount;
            if (possibility.isGroup) {
                result.mf += `(${possibility.mf})${possibility.currentCount}`;
            } else {
                result.mf += possibility.mf;
                if (possibility.currentCount !== 1) result.mf += possibility.currentCount;
            }
        }
    }
    if (result.charge !== 0) {
        result.msem = (result.em - ELECTRON_MASS * result.charge) / result.charge;
        result.ppm = (targetMass - result.msem) / targetMass * 1e6;
    } else if (allowNeutralMolecules) {
        result.msem = result.em;
        result.ppm = (targetMass - result.msem) / targetMass * 1e6;
    }
    result.unsaturation = (result.unsaturation + result.charge) / 2 + 1;
    return result;
}


/*
    Need to call this method each time the targetMass changes
    We should take care that we can only make optimisation if the charge
    will not change after !!!
*/
function updateRealMinMax(possibilities, targetMass, massRange) {
    for (let possibility of possibilities) {
        possibility.maxCount = Math.min(possibility.originalMaxCount, Math.floor((targetMass + massRange) / possibility.em));
    }
}


function setCurrentMinMax(currentAtom, previousAtom) {
    // the current min max can only be optimize if the charge will not change anymore
    if (currentAtom.innerCharge) {
        currentAtom.currentMinCount = currentAtom.originalMinCount;
        currentAtom.currentMaxCount = currentAtom.originalMaxCount;
        currentAtom.currentCount = currentAtom.currentMinCount - 1;
    } else { // no more change of charge, we can optimize
        let currentMass = previousAtom ? previousAtom.currentMonoisotopicMass : 0;
        let charge = currentAtom.charge;
        currentAtom.currentMinCount = Math.max(Math.floor((targetMassCache.getMinMass(charge) - currentMass - currentAtom.maxInnerMass) / currentAtom.em), currentAtom.originalMinCount);
        currentAtom.currentMaxCount = Math.min(Math.ceil((targetMassCache.getMaxMass(charge) - currentMass - currentAtom.minInnerMass) / currentAtom.em), currentAtom.originalMaxCount);
        currentAtom.currentCount = currentAtom.currentMinCount - 1;
    }
}

