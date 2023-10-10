import { getDatabase } from '../getDatabase.js';

describe('getDatabase', () => {
  it('should return the  ionization DB positive', () => {
    const ionizationDB = getDatabase({ kind: 'ionization', mode: 'positive' });
    expect(ionizationDB).toHaveLength(11);
  });
  it('should return the  ionization DB negative', () => {
    const ionizationDB = getDatabase({ mode: 'negative' });
    expect(ionizationDB).toHaveLength(6);
  });
  it('should return the  reactions DB negative', () => {
    const ionizationDB = getDatabase({ kind: 'reaction', mode: 'negative' });
    expect(ionizationDB).toHaveLength(24);
  });
  it('should return the  reactions DB positive', () => {
    const ionizationDB = getDatabase({ kind: 'reaction', mode: 'positive' });
    expect(ionizationDB).toHaveLength(65);
  });
  it('should return the  resonance DB positive', () => {
    const ionizationDB = getDatabase({ kind: 'resonance', mode: 'positive' });
    expect(ionizationDB).toHaveLength(13);
  });
});
