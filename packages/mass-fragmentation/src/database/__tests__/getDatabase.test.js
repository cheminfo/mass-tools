import { describe, expect, it } from 'vitest';

import { getDatabase } from '../getDatabase.js';

describe('getDatabase', () => {
  it('should return the default database', () => {
    const db = getDatabase();

    expect(db).toHaveLength(187);
  });

  it('kind:all and ionizationKind:esiPositive', () => {
    const db = getDatabase({
      kind: ['ionization', 'resonance', 'reaction'],
      ionizations: ['esi'],
      modes: ['positive'],
    });

    expect(db).toHaveLength(184);
  });

  it('kind:all and ionizationKind:esiNegative', () => {
    const db = getDatabase({
      kind: ['ionization', 'resonance', 'reaction'],
      ionizations: ['esi'],
      modes: ['negative'],
    });

    expect(db).toHaveLength(26);
  });

  it('kind:all and ionizationKind:ei', () => {
    const db = getDatabase({
      kind: ['ionization', 'resonance', 'reaction'],
      ionizations: ['ei'],
    });

    expect(db).toHaveLength(46);
  });

  it('kind:ionization and ionizationKind:all', () => {
    const db = getDatabase({
      kind: ['ionization'],
      ionizations: ['esi', 'ei'],
      modes: ['positive', 'negative'],
    });

    expect(db).toHaveLength(13);
  });

  it('kind:ionization and ionizationKind:esiPositive', () => {
    const db = getDatabase({
      kind: ['ionization'],
      ionizations: ['esi'],
      modes: ['positive'],
    });

    expect(db).toHaveLength(12);
  });

  it('kind:ionization and ionizationKind:esiNegative', () => {
    const db = getDatabase({
      kind: ['ionization'],
      ionizations: ['esi'],
      modes: ['negative'],
    });

    expect(db).toHaveLength(1);
  });

  it('kind:ionization and ionizationKind:ei', () => {
    const db = getDatabase({
      kind: ['ionization'],
      ionizations: ['ei'],
    });

    expect(db).toHaveLength(0);
  });

  it('kind:resonance and ionizationKind:all', () => {
    const db = getDatabase({
      kind: ['resonance'],
      ionizations: ['esi', 'ei'],
      modes: ['positive', 'negative'],
    });

    expect(db).toHaveLength(3);
  });

  it('kind:resonance and ionizationKind:esiPositive', () => {
    const db = getDatabase({
      kind: ['resonance'],
      ionizations: ['esi'],
      modes: ['positive'],
    });

    expect(db).toHaveLength(3);
  });

  it('kind:resonance and ionizationKind:esiNegative', () => {
    const db = getDatabase({
      kind: ['resonance'],
      ionizations: ['esi'],
      modes: ['negative'],
    });

    expect(db).toHaveLength(0);
  });

  it('kind:resonance and ionizationKind:ei', () => {
    const db = getDatabase({
      kind: ['resonance'],
      ionizations: ['ei'],
    });

    expect(db).toHaveLength(0);
  });

  it('kind:reaction and ionizationKind:all', () => {
    const db = getDatabase({
      kind: ['reaction'],
      ionizations: ['esi'],
      modes: ['positive', 'negative'],
    });

    expect(db).toHaveLength(171);
  });

  it('kind:reaction and ionizationKind:esiPositive', () => {
    const db = getDatabase({
      kind: ['reaction'],
      ionizations: ['esi'],
      modes: ['positive'],
    });

    expect(db).toHaveLength(169);
  });

  it('kind:reaction and ionizationKind:esiNegative', () => {
    const db = getDatabase({
      kind: ['reaction'],
      ionizations: ['esi'],
      modes: ['negative'],
    });

    expect(db).toHaveLength(25);
  });

  it('kind:reaction and ionizationKind:ei', () => {
    const db = getDatabase({
      kind: ['reaction'],
      ionizations: ['ei'],
    });

    expect(db).toHaveLength(46);
  });
});
