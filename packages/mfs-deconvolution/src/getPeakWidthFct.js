/**
 *
 * @param {object} [options ={}]
 * @param {object}        [options.mass={}]
 * @param {number}        [options.mass.precision=0] -  Precision (accuracy) of the monoisotopic mass in ppm
 * @param {string|Function} [options.mass.peakWidthFct=()=>0.01]
 * @param {import('cheminfo-types').Logger} [options.logger]
 * @returns
 */
export function getPeakWidthFct(options = {}) {
  const { logger, mass: massOptions = {} } = options;
  const { precision = 0, peakWidthFct } = massOptions;
  if (peakWidthFct instanceof Function) {
    return peakWidthFct;
  }
  if (!peakWidthFct) {
    return () => 0.01;
  }
  try {
    // eslint-disable-next-line no-new-func
    return new Function(
      'mass',
      `return ${peakWidthFct} + ${precision} * mass / 1e6`,
    );
  } catch (error) {
    logger?.warn(`error in peakWidthFct: ${error.toString()}`);
    return () => 0.01;
  }
}
