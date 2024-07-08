export function parseMasses(masses) {
  if (!masses) return [];
  if (Array.isArray(masses)) return masses;
  if (typeof masses === 'number') {
    return [masses];
  }
  if (typeof masses === 'string') {
    return masses
      .split(/[\t\n\r ,;]+/)
      .filter(Boolean)
      .map(Number);
  }
  throw new Error('Cannot parse masses');
}
