export function parseMassesAndMFs(options) {
  const { masses = [0] } = options;
  if (typeof masses === 'number') {
    return [masses];
  }
  if (typeof masses === 'string') {
    return masses
      .split(/[\r\n\t,; ]+/)
      .filter((value) => value)
      .map(Number);
  }
  return masses;
}
