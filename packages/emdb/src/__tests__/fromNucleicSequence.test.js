'use strict';

const DBManager = require('..');

test('test fromNucleicSequence', () => {
  let dbManager = new DBManager();
  dbManager.fromNucleicSequence('AAA', {
    ionizations: 'H+,Na+',
    fragmentation: {
      a: true,
    },
    info: {
      kind: 'dna',
    },
  });
  let nucleic = dbManager.databases.nucleic.sort((a, b) => a.ms.em - b.ms.em);
  expect(nucleic).toHaveLength(6);
  expect(nucleic).toMatchSnapshot();
});

test('test fromNucleicSequence ds-DNA', () => {
  let dbManager = new DBManager();
  dbManager.fromNucleicSequence('AAA', {
    ionizations: 'H+,Na+',
    fragmentation: {
      a: true,
    },
    info: {
      kind: 'dsdna',
    },
  });

  let nucleic = dbManager.databases.nucleic.sort((a, b) => a.ms.em - b.ms.em);

  expect(nucleic).toHaveLength(12);
  expect(nucleic).toMatchSnapshot();
});

test('test TACGTGCCAATAC internal fragment', () => {
  let dbManager = new DBManager();
  dbManager.fromNucleicSequence('TACGTGCCAATAC', {
    ionizations: '(H+)-5',
    fragmentation: {
      abw: true,
    },
    info: {
      kind: 'dna',
    },
  });

  let nucleic = dbManager.databases.nucleic.sort((a, b) => a.ms.em - b.ms.em);

  expect(nucleic).toHaveLength(56);
  expect(nucleic).toMatchSnapshot();
});

test('test AGGCAG fragment', () => {
  let dbManager = new DBManager();
  dbManager.fromNucleicSequence('AGGCAG', {
    ionizations: '(H+)-',
    fragmentation: {
      y: true,
    },
    info: {
      kind: 'dna',
    },
  });
  let nucleic = dbManager.databases.nucleic.sort((a, b) => a.ms.em - b.ms.em);
  expect(nucleic).toHaveLength(6);
  expect(nucleic).toMatchSnapshot();
});

test('test AGG with d-h2o and base loss', () => {
  let dbManager = new DBManager();
  dbManager.fromNucleicSequence('AGG', {
    ionizations: '(H+)-1',
    fragmentation: {
      dh2o: true,
      baseLoss: true,
    },

    info: {
      kind: 'dna',
    },
  });
  let nucleic = dbManager.databases.nucleic.sort((a, b) => a.ms.em - b.ms.em);
  expect(nucleic).toHaveLength(6);
  expect(nucleic).toMatchSnapshot();
});
