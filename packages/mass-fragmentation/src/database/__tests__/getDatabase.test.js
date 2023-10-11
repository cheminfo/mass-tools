import { getDatabase } from '../getDatabase.js';

describe('getDatabase', () => {
  it('should return the default database', () => {
    const db = getDatabase();
    expect(db).toHaveLength(153);
  });
  it('kind:all and ionizationKind:esiPositive', () => {
    const db = getDatabase({
      kind: ['ionization', 'resonance', 'reaction'],
      ionizationKind: ['esiPositive'],
    });
    expect(db).toHaveLength(89);
  });
  it('kind:all and ionizationKind:esiNegative', () => {
    const db = getDatabase({
      kind: ['ionization', 'resonance', 'reaction'],
      ionizationKind: ['esiNegative'],
    });
    expect(db).toHaveLength(30);
  });
  it('kind:all and ionizationKind:ei', () => {
    const db = getDatabase({
      kind: ['ionization', 'resonance', 'reaction'],
      ionizationKind: ['ei'],
    });
    expect(db).toHaveLength(34);
  });
  it('kind:ionization and ionizationKind:all', () => {
    const db = getDatabase({
      kind: ['ionization'],
      ionizationKind: ['esiPositive', 'esiNegative', 'ei'],
    });
    expect(db).toHaveLength(24);
  });
  it('kind:ionization and ionizationKind:esiPositive', () => {
    const db = getDatabase({
      kind: ['ionization'],
      ionizationKind: ['esiPositive'],
    });
    expect(db).toHaveLength(11);
  });
  it('kind:ionization and ionizationKind:esiNegative', () => {
    const db = getDatabase({
      kind: ['ionization'],
      ionizationKind: ['esiNegative'],
    });
    expect(db).toHaveLength(6);
  });
  it('kind:ionization and ionizationKind:ei', () => {
    const db = getDatabase({
      kind: ['ionization'],
      ionizationKind: ['ei'],
    });
    expect(db).toHaveLength(7);
  });
  it('kind:resonance and ionizationKind:all', () => {
    const db = getDatabase({
      kind: ['resonance'],
      ionizationKind: ['esiPositive', 'esiNegative', 'ei'],
    });
    expect(db).toHaveLength(14);
  });
  it('kind:resonance and ionizationKind:esiPositive', () => {
    const db = getDatabase({
      kind: ['resonance'],
      ionizationKind: ['esiPositive'],
    });
    expect(db).toHaveLength(13);
  });
  it('kind:resonance and ionizationKind:esiNegative', () => {
    const db = getDatabase({
      kind: ['resonance'],
      ionizationKind: ['esiNegative'],
    });
    expect(db).toHaveLength(1);
  });
  it('kind:resonance and ionizationKind:ei', () => {
    const db = getDatabase({
      kind: ['resonance'],
      ionizationKind: ['ei'],
    });
    expect(db).toHaveLength(0);
  });
  it('kind:reaction and ionizationKind:all', () => {
    const db = getDatabase({
      kind: ['reaction'],
      ionizationKind: ['esiPositive', 'esiNegative', 'ei'],
    });
    expect(db).toHaveLength(115);
  });
  it('kind:reaction and ionizationKind:esiPositive', () => {
    const db = getDatabase({
      kind: ['reaction'],
      ionizationKind: ['esiPositive'],
    });
    expect(db).toHaveLength(65);
  });
  it('kind:reaction and ionizationKind:esiNegative', () => {
    const db = getDatabase({
      kind: ['reaction'],
      ionizationKind: ['esiNegative'],
    });
    expect(db).toHaveLength(23);
  });
  it('kind:reaction and ionizationKind:ei', () => {
    const db = getDatabase({
      kind: ['reaction'],
      ionizationKind: ['ei'],
    });
    expect(db).toHaveLength(27);
  });
});