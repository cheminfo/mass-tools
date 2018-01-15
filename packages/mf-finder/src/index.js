'use strict';




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
 * @return {number}
 */
module.exports=function findMF(targetMass, options={}) {
    const {
        minEM = 0,
        maxEM = +Infinity,
        minCharge = -Infinity,
        maxCharge = +Infinity,
        minUnsaturation = -Infinity,
        maxUnsaturation = +Infinity,
        onlyIntegerUnsaturation,
        onlyNonIntegerUnsaturation,
        ranges=[{

        }]
    } = options;
}
