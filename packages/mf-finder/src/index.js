'use strict';

const preprocessRanges = require('./preprocessRanges');

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
        allowNeutralMolecules = false, // msem because em in this case !
        ranges = [
            {mf: 'C', min: 0, max: 100},
            {mf: 'H', min: 0, max: 100},
            {mf: 'O', min: 0, max: 100},
            {mf: 'N', min: 0, max: 100},
        ],
        precision = 100,
        modifications = '',
    } = options;

    let filterUnsaturation = (minUnsaturation !== Number.MIN_SAFE_INTEGER || maxUnsaturation !== Number.MAX_SAFE_INTEGER || onlyIntegerUnsaturation || onlyNonIntegerUnsaturation);
    // we calculate not the real unsaturation but the one before dividing by 2 + 1
    let fakeMinUnsaturation = (minUnsaturation === Number.MIN_SAFE_INTEGER) ? Number.MIN_SAFE_INTEGER : (minUnsaturation - 1) * 2;
    let fakeMaxUnsaturation = (maxUnsaturation === Number.MAX_SAFE_INTEGER) ? Number.MAX_SAFE_INTEGER : (maxUnsaturation - 1) * 2;

    let filterCharge = (minCharge !== Number.MIN_SAFE_INTEGER || maxCharge !== Number.MAX_SAFE_INTEGER);

    let result = {
        mfs: []
    };
    console.log('ab');
    let possibilities = preprocessRanges(ranges);

    let iterationNumber = 0;
    let numberResults = 0;


    result.info = {};

    let theEnd = false;
    let maxPosition = possibilities.length;
    let lastPosition = possibilities.length - 1;
    let currentPosition = lastPosition;
    let currentAtom;
    let previousAtom;
    let previousCharge;
    /*
        To optimize the procedure we should limit the number of time we change the charge !
    */
    let massRange = 0;
    let minMass = 0;
    let maxMass = 0;
    let currentTargetMass = 0;
    let lastPossibility = possibilities[lastPosition];

    console.log(possibilities);

    while (!theEnd) {

        console.log(possibilities.map(a => a.currentCount));

        if (currentPosition === lastPosition) {
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
            if ((lastPossibility.currentMonoisotopicMass < minMass) || (lastPossibility.currentMonoisotopicMass > maxMass)) {
                isValid = false;
            }

            if (isValid) {
                result.mfs.push(getResult(possibilities, targetMass, allowNeutralMolecules));
            }
        }

        // we need to setup all the arrays if possible
        while (currentPosition < maxPosition && currentPosition >= 0) {
            if (iterationNumber++ > maxIterations) {
                throw Error('Iteration number is over the current maximum of: ' + maxIterations);
            }
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
                    setCurrentMinMax(possibilities[currentPosition], possibilities[currentPosition - 1], currentTargetMass, massRange);
                } else {
                    break;
                }
            } else {
                currentPosition--;
            }

            // if charge is changing we need to reconsider everything
            /*
            console.log(currentPosition, currentCharge);
            if (previousCharge !== currentCharge[currentPosition]) {
                console.log('Charge changed', currentPosition, currentCharge);
                previousCharge=currentCharge[currentPosition];
                currentTargetMass = (targetMass-ELECTRON_MASS*previousCharge)*Math.abs(previousCharge);
                massRange = currentTargetMass * precision / 1e6;
                minMass=currentTargetMass-massRange;
                maxMass=currentTargetMass+massRange;
                updateRealMinMax(possibilities, currentTargetMass, massRange);
                setCurrentMinMax(possibilities[0], 0, currentTargetMass, minInnerMass[0], maxInnerMass[0], massRange);
            }
            */

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
                result.mf += '(' + possibility.mf + ')' + possibility.currentCount;
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


function setCurrentMinMax(currentAtom, previousAtom, targetMass, massRange) {
    // the current min max can only be optimize if the charge will not change anymore
    if (currentAtom.innerCharge) {
        currentAtom.currentMinCount = currentAtom.originalMinCount;
        currentAtom.currentMaxCount = currentAtom.originalMaxCount;
        currentAtom.currentCount = currentAtom.currentMinCount - 1;
    } else { // no more change of charge, we can optimize

        let currentMass = previousAtom.currentMonoisotopicMass;
        currentAtom.currentMinCount = Math.max(Math.floor((targetMass - massRange - currentMass - currentAtom.maxInnerMass) / currentAtom.em), currentAtom.originalMinCount);
        currentAtom.currentMaxCount = Math.min(Math.ceil((targetMass + massRange - currentMass - currentAtom.minInnerMass) / currentAtom.em), currentAtom.originalMaxCount);
        currentAtom.currentCount = currentAtom.currentMinCount - 1;
    }
}


function getTargetMassCache(possibilities, options = {}) {
    const {
        allowNeutralMolecules = false, // msem because em in this case !
        minCharge = Number.MIN_SAFE_INTEGER,
        maxCharge = Number.MAX_SAFE_INTEGER,
    } = options;
    // we need to calculate the minimal and maximal global charge
    let minCharge = 0;
    let maxCharge = 0;
    if (possibilities.length > 0) {
        let possibility = possibilities[0];
        if (possibility.charge > 0) {
            minCharge += possibility.charge * possibility.originalMinCount;
            maxCharge += possibility.charge * possibility.originalMaxCount;
        } else {
            minCharge -= possibility.charge * possibility.originalMinCount;
            maxCharge -= possibility.charge * possibility.originalMaxCount;
        }
        if (possibilities.length > 1) {
            let nextPossibility = possibilities[1];
            minCharge += nextPossibility.minCharge;
            maxCharge += nextPossibility.maxCharge;
        }
    }


}
