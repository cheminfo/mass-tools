export function parseMasses(masses) {
  if (!masses) return [];
  if (Array.isArray(masses)) return masses;
  if (typeof masses === 'number') {
    return [masses];
  }
  if (typeof masses === 'string') {
    return masses
      .split(/[\r\n\t,; ]+/)
      .filter((value) => value)
      .map(Number);
  }
  throw new Error('Cannot parse masses');
}
