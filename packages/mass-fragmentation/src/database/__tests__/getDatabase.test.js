import { getDatabase } from '../getDatabase.js';

describe('getDatabase', () => {
  it('should return the default database', () => {
    const db = getDatabase({ kind: 'all', ionizationKind: 'all' });
    expect(db).toHaveLength(153);
  });
  it('kind:all and ionizationKind:esiPos', () => {
    const db = getDatabase({ kind: 'all', ionizationKind: 'esiPos' });
    expect(db).toHaveLength(89);
  });
  it('kind:all and ionizationKind:esiNeg', () => {
    const db = getDatabase({ kind: 'all', ionizationKind: 'esiNeg' });
    expect(db).toHaveLength(30);
  });
  it('kind:all and ionizationKind:ei', () => {
    const db = getDatabase({ kind: 'all', ionizationKind: 'ei' });
    expect(db).toHaveLength(34);
  });
  it('kind:ionization and ionizationKind:all', () => {
    const db = getDatabase({ kind: 'ionization', ionizationKind: 'all' });
    expect(db).toHaveLength(24);
  });
  it('kind:ionization and ionizationKind:esiPos', () => {
    const db = getDatabase({ kind: 'ionization', ionizationKind: 'esiPos' });
    expect(db).toHaveLength(11);
  });
  it('kind:ionization and ionizationKind:esiNeg', () => {
    const db = getDatabase({ kind: 'ionization', ionizationKind: 'esiNeg' });
    expect(db).toHaveLength(6);
  });
  it('kind:ionization and ionizationKind:ei', () => {
    const db = getDatabase({ kind: 'ionization', ionizationKind: 'ei' });
    expect(db).toHaveLength(7);
  });
  it('kind:resonance and ionizationKind:all', () => {
    const db = getDatabase({ kind: 'resonance', ionizationKind: 'all' });
    expect(db).toHaveLength(14);
  });
  it('kind:resonance and ionizationKind:esiPos', () => {
    const db = getDatabase({ kind: 'resonance', ionizationKind: 'esiPos' });
    expect(db).toHaveLength(13);
  });
  it('kind:resonance and ionizationKind:esiNeg', () => {
    const db = getDatabase({ kind: 'resonance', ionizationKind: 'esiNeg' });
    expect(db).toHaveLength(1);
  });
  it('kind:resonance and ionizationKind:ei', () => {
    const db = getDatabase({ kind: 'resonance', ionizationKind: 'ei' });
    expect(db).toHaveLength(0);
  });
  it('kind:reaction and ionizationKind:all', () => {
    const db = getDatabase({ kind: 'reaction', ionizationKind: 'all' });
    expect(db).toHaveLength(115);
  });
  it('kind:reaction and ionizationKind:esiPos', () => {
    const db = getDatabase({ kind: 'reaction', ionizationKind: 'esiPos' });
    expect(db).toHaveLength(65);
  });
  it('kind:reaction and ionizationKind:esiNeg', () => {
    const db = getDatabase({ kind: 'reaction', ionizationKind: 'esiNeg' });
    expect(db).toHaveLength(23);
  });
  it('kind:reaction and ionizationKind:ei', () => {
    const db = getDatabase({ kind: 'reaction', ionizationKind: 'ei' });
    expect(db).toHaveLength(27);
  });
});
