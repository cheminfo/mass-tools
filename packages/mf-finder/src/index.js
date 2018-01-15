'use strict';

const MF=require('mf-parser').MF
const ELECTRON_MASS=require('chemical-elements/src/constants').ELECTRON_MASS;
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

module.exports=function findMF(targetMass, options={}) {
    const {
        minCharge = Number.MIN_SAFE_INTEGER,
        maxCharge = Number.MAX_SAFE_INTEGER,
        minUnsaturation = Number.MIN_SAFE_INTEGER,
        maxUnsaturation = Number.MAX_SAFE_INTEGER,
        onlyIntegerUnsaturation,
        onlyNonIntegerUnsaturation,
        maxIterations=1e8,
        maxResults=1e5,
        allowNeutralMolecules=false, // msem because em in this case !
        ranges=[
            {mf: 'C',min:0,max:100},
            {mf: 'H',min:0,max:100},
            {mf: 'O',min:0,max:100},
            {mf: 'N',min:0,max:100},
        ],
        precision=100,
        modifications='',
    } = options;

    let filterUnsaturation = (minUnsaturation !== Number.MIN_SAFE_INTEGER || maxUnsaturation !==  Number.MAX_SAFE_INTEGER || onlyIntegerUnsaturation || onlyNonIntegerUnsaturation);
   // we calculate not the real unsaturation but the one before dividing by 2 + 1
    let fakeMinUnsaturation = (minUnsaturation === Number.MIN_SAFE_INTEGER) ? Number.MIN_SAFE_INTEGER : (minUnsaturation - 1)*2;
    let fakeMaxUnsaturation = (maxUnsaturation === Number.MAX_SAFE_INTEGER) ? Number.MAX_SAFE_INTEGER : (maxUnsaturation - 1)*2;



    let filterCharge = (minCharge !== Number.MIN_SAFE_INTEGER || maxCharge !==  Number.MAX_SAFE_INTEGER);

    let result={
        mfs:[]
    };
    let possibilities=getPossitibilites(ranges);
    
    let iterationNumber=0;
    let numberResults=0;
    
    /*
        In order to deal with charges we will change the targetMass, minMass and maxMass
        However some parameter will never change like the innerMass
     */
    var minInnerMass=(new Array(possibilities.length)).fill(0);
    var maxInnerMass=(new Array(possibilities.length)).fill(0);     
    updateMinMaxInnerMass(possibilities, minInnerMass, maxInnerMass);

    

    // we maintain in an array the hierarchy to have permanently the exact mass
    var currentMonoisotopicMass=(new Array(possibilities.length)).fill(0);
    var currentCharge=(new Array(possibilities.length)).fill(0);
    var currentUnsaturation=(new Array(possibilities.length)).fill(0);
    // we have an array of the min and max inner mass for a specific level

   
    result.info={}

    let theEnd=false;
    let currentPosition=0;
    let maxPosition=possibilities.length;
    let currentAtom;
    let previousCharge;
    /*
        To optimize the procedure we should limit the number of time we change the charge !
    */
    let massRange = 0;
    let minMass=0;
    let maxMass=0;
    let currentTargetMass=0;

    while (!theEnd) {
        if (iterationNumber > maxIterations) {
            throw Error("Iteration number is over the current maximum of: "+maxIterations);
        }
        let isValid=true;
        if (filterUnsaturation) {
            let unsaturation = currentUnsaturation[currentPosition];
            if (
                (onlyIntegerUnsaturation && unsaturation%2 === 1) ||
                (onlyNonIntegerUnsaturation && unsaturation%2 === 0) ||
                (fakeMinUnsaturation > unsaturation) ||
                (fakeMaxUnsaturation < unsaturation)
             ) isValid=false;
        }
        if (filterCharge && (currentCharge[currentPosition]<minCharge || currentCharge[currentPosition]>maxCharge)) {
            isValid=false;
        }
        if ((currentMonoisotopicMass[currentPosition]<minMass) || (currentMonoisotopicMass[currentPosition]>maxMass)) {
            isValid=false;
        }

        if (isValid) {
            result.mfs.push(getResult(possibilities, targetMass, allowNeutralMolecules));
        }
        
        // we need to setup all the arrays if possible
        while (currentPosition<maxPosition && currentPosition>=0) {
            // if charge is changing we need to reconsider everything
            if (previousCharge !== currentCharge[currentPosition]) {
                previousCharge=currentCharge[currentPosition];
                console.log('change charge');
                currentTargetMass = (targetMass-ELECTRON_MASS*previousCharge)*Math.abs(previousCharge);
                massRange = currentTargetMass * precision / 1e6;
                minMass=currentTargetMass-massRange;
                maxMass=currentTargetMass+massRange;
                updateRealMinMax(possibilities, currentTargetMass, massRange);
                setCurrentMinMax(possibilities[0], 0, currentTargetMass, minInnerMass[0], maxInnerMass[0], massRange);
            }
            

            iterationNumber++;
            currentAtom=possibilities[currentPosition];
            if (currentAtom.currentCount<currentAtom.currentMaxCount) {
                currentAtom.currentCount++;
                if (currentPosition==0) {
                    currentMonoisotopicMass[currentPosition]=currentAtom.em*currentAtom.currentCount;
                    currentCharge[currentPosition]=currentAtom.charge*currentAtom.currentCount;
                    currentUnsaturation[currentPosition]=currentAtom.unsaturation*currentAtom.currentCount;
                } else {
                    currentMonoisotopicMass[currentPosition]=currentMonoisotopicMass[currentPosition-1]+currentAtom.em*currentAtom.currentCount;
                    currentCharge[currentPosition]=currentCharge[currentPosition-1]+currentAtom.charge*currentAtom.currentCount;
                    currentUnsaturation[currentPosition]=currentUnsaturation[currentPosition-1]+currentAtom.unsaturation*currentAtom.currentCount;
                }
                
                if (currentPosition<(maxPosition-1)) {
                    currentPosition++;
                    setCurrentMinMax(possibilities[currentPosition], currentMonoisotopicMass[currentPosition-1], targetMass, minInnerMass[currentPosition], maxInnerMass[currentPosition], massRange);
                } else {
                    break;
                }
            } else {					
                currentPosition--;
            }
        }
        
        if (currentPosition<0) {
            theEnd=true;
        }
        

    }
    return result;
}

function getResult(possibilities, targetMass, allowNeutralMolecules) {
    let result={
        em:0,
        unsaturation:0,
        mf:'',
        charge:0,
        msem:0
    }
    for (let possibility of possibilities) {
        if (possibility.currentCount!=0) {
            result.em+=possibility.em*possibility.currentCount;
            result.charge+=possibility.charge*possibility.currentCount;
            result.unsaturation+=possibility.unsaturation*possibility.currentCount;
            if (possibility.isGroup) {
                result.mf+='('+possibility.mf+')'+possibility.currentCount;
            } else {
                result.mf+=possibility.mf;
                if (possibility.currentCount!==1) result.mf+=possibility.currentCount;
            }
        }
    } 
    if (result.charge!==0) {
        result.msem=(result.em-ELECTRON_MASS*result.charge)/result.charge;
        result.ppm=(targetMass-result.msem)/targetMass*1e6;
    } else if (allowNeutralMolecules) {
        result.msem=result.em;
        result.ppm=(targetMass-result.msem)/targetMass*1e6;
    }
    result.unsaturation=(result.unsaturation+result.charge)/2+1;
    return result;
}

function getPossitibilites(ranges) {
    var results=[];
    for (let range of ranges) {
        let result={
            mf: range.mf,
            minCount: range.min || 0,
            originalMaxCount: range.max || 1, // value defined by the user
            maxCount: range.max || 1,
            current: range.min || 0,
        };
        results.push(result);
        let info=new MF(range.mf).getInfo();
        result.em = range.em || info.monoisotopicMass;
        result.charge = range.charge || info.charge;
        result.unsaturation = (range.unsaturation===undefined) ? info.unsaturation : range.unsaturation;
        if (result.mf!==info.mf) result.isGroup=true;
    }
    return results;
}

/*
    Need to call this method each time the targetEM changes
*/
function updateRealMinMax(possibilities, targetMass, massRange) {
    for (let possibility of possibilities) {
        possibility.maxCount=Math.min(possibility.originalMaxCount, Math.floor((targetMass+massRange)/possibility.em));
    }
}

function updateMinMaxInnerMass(possibilities, minInnerMass, maxInnerMass) {
    for (let i=0; i<possibilities.length; i++) {
        minInnerMass[i]=0;
        maxInnerMass[i]=0;
        for (let j=i+1; j<possibilities.length; j++) {
            let possibility=possibilities[j];
            minInnerMass[i]+=possibility.em*possibility.minCount;
            maxInnerMass[i]+=possibility.em*possibility.maxCount;;
        }
    }
}

function setCurrentMinMax(possibility, currentMass, targetMass, minInnerMass, maxInnerMass, massRange) {
    possibility.currentMinCount=Math.max(Math.floor((targetMass-massRange-currentMass-maxInnerMass)/possibility.em),possibility.minCount);
    possibility.currentMaxCount=Math.min(Math.ceil((targetMass+massRange-currentMass-minInnerMass)/possibility.em),possibility.maxCount);
    possibility.currentCount=possibility.currentMinCount-1;
}