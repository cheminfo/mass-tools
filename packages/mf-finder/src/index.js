'use strict';

const preprocessRanges = require('./preprocessRanges');
const preprocessModifications = require('mf-utils/src/preprocessModifications');
const getMsem = require('mf-utils/src/getMsem');
const TargetMassCache = require('./TargetMassCache');

/**
 * Returns possible combinations
 * * @return {}
 */


let targetMassCache;

module.exports = function findMF(targetMass, options = {}) {
    const {
        minCharge = Number.MIN_SAFE_INTEGER,
        maxCharge = Number.MAX_SAFE_INTEGER,
        minUnsaturation = Number.MIN_SAFE_INTEGER,
        maxUnsaturation = Number.MAX_SAFE_INTEGER,
        onlyIntegerUnsaturation = false,
        onlyNonIntegerUnsaturation = false,
        maxIterations = 1e8,
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

    // we need to make the processing for all the modifications
    let modifications = preprocessModifications(options.modifications);
    for (let modification of modifications) {
        let possibilities = preprocessRanges(ranges, modification);
        if (possibilities.length === 0) return { mfs: [] };

        targetMassCache = new TargetMassCache(targetMass, possibilities, options);
        result.info = {
            numberMFEvaluated: 0,
            numberResults: 0,
        };


        let theEnd = false;
        let maxPosition = possibilities.length;
        let lastPosition = possibilities.length - 1;
        let currentPosition = 0;
        let currentAtom;
        let previousAtom;
        let lastPossibility = possibilities[lastPosition];

        // console.debug('initializing the possibilities');
        initializePossibilities(possibilities);

        while (!theEnd) {
            /*
             console..debug(
                'Currently evaluating',
                result.info.numberMFEvaluated,
                possibilitiesToString(possibilities)
            );
            */
            if (result.info.numberMFEvaluated++ > maxIterations) {
                throw Error(`Iteration number is over the current maximum of: ${maxIterations}`);
            }

            let isValid = true;
            if (filterUnsaturation) {
                let unsaturation = lastPossibility.currentUnsaturation;
                let isOdd = Math.abs(unsaturation % 2);
                if (
                    (onlyIntegerUnsaturation && isOdd === 1) ||
                    (onlyNonIntegerUnsaturation && isOdd === 0) ||
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
                // console.log('xxxxx', isValid, minMass, maxMass, lastPossibility);
            }
            if (isValid) {
                result.mfs.push(getResult(possibilities, targetMass, allowNeutral, modification));
                result.info.numberResults++;
            }


            // we need to setup all the arrays if possible
            while (currentPosition < maxPosition && currentPosition >= 0) {
                currentAtom = possibilities[currentPosition];
                previousAtom = (currentPosition === 0) ? undefined : possibilities[currentPosition - 1];
                if (currentAtom.currentCount < currentAtom.currentMaxCount) {
                    //      console.log('currentPosition', currentPosition, currentAtom.currentCount, currentAtom.currentMaxCount);
                    currentAtom.currentCount++;
                    updateCurrentAtom(currentAtom, previousAtom);
                    //  console.log('updated', currentAtom);
                    if (currentPosition < lastPosition) {
                        currentPosition++;
                        setCurrentMinMax(possibilities[currentPosition], possibilities[currentPosition - 1]);
                        // console..debug('MIN/MAX', currentPosition, possibilitiesToString(possibilities));
                    } else {
                        break;
                    }
                } else {
                    currentPosition--;
                }
            }

            // console..debug('After', possibilities.map((a) => [a.currentCount, a.currentMinCount, a.currentMaxCount]));

            if (currentPosition < 0) {
                theEnd = true;
            }
        }
    }

    result.mfs.sort((a, b) => a.ppm - b.ppm);
    return result;
};

function updateCurrentAtom(currentAtom, previousAtom) {
//    console.log('UPDATE');
    if (previousAtom !== undefined) {
        currentAtom.currentMonoisotopicMass = previousAtom.currentMonoisotopicMass + currentAtom.em * currentAtom.currentCount;
        currentAtom.currentCharge = previousAtom.currentCharge + currentAtom.charge * currentAtom.currentCount;
        currentAtom.currentUnsaturation = previousAtom.currentUnsaturation + currentAtom.unsaturation * currentAtom.currentCount;
        //       console.log('PREVIOUS', previousAtom.mf, previousAtom.charge, previousAtom.currentCount, previousAtom.currentCharge);
    } else {
        currentAtom.currentMonoisotopicMass = currentAtom.em * currentAtom.currentCount;
        currentAtom.currentCharge = currentAtom.charge * currentAtom.currentCount;
        currentAtom.currentUnsaturation = currentAtom.unsaturation * currentAtom.currentCount;
    }
    //  console.log('CURRENT', currentAtom.mf, currentAtom.charge, currentAtom.currentCount, currentAtom.currentCharge);

}

function getResult(possibilities, targetMass, allowNeutralMolecules, modification) {
    let result = {
        em: 0,
        unsaturation: 0,
        mf: '',
        charge: 0,
        msem: 0,
        delta: 0,
        modification: modification ? modification : undefined
    };

    let firstModification = modification ? true : false;
    for (let possibility of possibilities) {
        if (possibility.currentCount !== 0) {

            result.charge += possibility.charge * possibility.currentCount;
            if (firstModification && modification.mf === possibility.mf) {
                firstModification = false;
            } else {
                result.em += possibility.em * possibility.currentCount;
                result.unsaturation += possibility.unsaturation * possibility.currentCount;
                if (possibility.isGroup) {
                    result.mf += `(${possibility.mf})`;
                    if (possibility.currentCount !== 1) result.mf += possibility.currentCount;
                } else {
                    result.mf += possibility.mf;
                    if (possibility.currentCount !== 1) result.mf += possibility.currentCount;
                }
            }
        }
    }
    if (result.charge !== 0) {
        result.msem = getMsem(result.em, result.charge);
        result.delta = result.msem - targetMass;
        result.ppm = Math.abs((targetMass - result.msem) / targetMass * 1e6);
    } else if (allowNeutralMolecules) {
        result.msem = result.em;
        result.delta = result.em - targetMass;
        result.ppm = Math.abs((targetMass - result.msem) / targetMass * 1e6);
    }
    result.unsaturation = (result.unsaturation + result.charge - modification.charge) / 2 + 1;
    return result;
}

function setCurrentMinMax(currentAtom, previousAtom) {
    // the current min max can only be optimize if the charge will not change anymore

    if (currentAtom.innerCharge === true || currentAtom.charge !== 0) {
        currentAtom.currentMinCount = currentAtom.originalMinCount;
        currentAtom.currentMaxCount = currentAtom.originalMaxCount;
        currentAtom.currentCount = currentAtom.currentMinCount - 1;
    } else { // no more change of charge, we can optimize
        let currentMass = previousAtom !== undefined ? previousAtom.currentMonoisotopicMass : 0;
        let currentCharge = previousAtom !== undefined ? previousAtom.currentCharge : 0;
        currentAtom.currentMinCount = Math.max(Math.floor((targetMassCache.getMinMass(currentCharge) - currentMass - currentAtom.maxInnerMass) / currentAtom.em), currentAtom.originalMinCount);
        currentAtom.currentMaxCount = Math.min(Math.floor((targetMassCache.getMaxMass(currentCharge) - currentMass - currentAtom.minInnerMass) / currentAtom.em), currentAtom.originalMaxCount);
        currentAtom.currentCount = currentAtom.currentMinCount - 1;
        //     console.log('After MIN / MAX', previousAtom.currentCount, currentAtom);
    }
}


function initializePossibilities(possibilities) {
    for (let i = 0; i < possibilities.length; i++) {
        if (i === 0) {
            setCurrentMinMax(possibilities[i]);
            updateCurrentAtom(possibilities[i]);

        } else {
            updateCurrentAtom(possibilities[i], possibilities[i - 1]);
        }
    }
}

// eslint-disable-next-line no-unused-vars
function possibilitiesToString(possibilities) {
    return possibilities.map((a) => [`mf:${a.mf}`, `current:${a.currentCount}`, `min:${a.currentMinCount}`, `max:${a.currentMaxCount}`, `charge:${a.currentCharge}`]);
}
