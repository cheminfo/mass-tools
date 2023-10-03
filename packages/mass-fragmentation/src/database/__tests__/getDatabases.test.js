import { getDatabases } from '../getDatabases.js';

describe('getDatabases', () => {
  it('should return the  ionization DB positive', () => {
    const ionizationDB = getDatabases({ kind: 'ionization', mode: 'positive' });
    expect(ionizationDB).toHaveLength(18);
  });
  it('should return the  ionization DB negative', () => {
    const ionizationDB = getDatabases({ mode: 'negative' });
    expect(ionizationDB).toHaveLength(6);
  });
  it('should return the  reactions DB negative', () => {
    const ionizationDB = getDatabases({ kind: 'reaction', mode: 'negative' });
    expect(ionizationDB).toHaveLength(27);
  });
  it('should return the  reactions DB positive', () => {
    const ionizationDB = getDatabases({ kind: 'reaction', mode: 'positive' });
    expect(ionizationDB).toHaveLength(88);
  });
  it('should return the  resonance DB positive', () => {
    const ionizationDB = getDatabases({ kind: 'resonance', mode: 'positive' });
    expect(ionizationDB).toHaveLength(13);
  });
});
