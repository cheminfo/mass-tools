import { generateMFs } from '../index.js';

describe('generateMFs', () => {
  it('empty', async () => {
    await expect(generateMFs()).rejects.toThrow(
      'Ranges must be an array of string or object',
    );
  });

  it('from array of array with comment', async () => {
    let mfsArray = [['C', 'H$YY'], [], [''], ['Cl', 'Br$XX']];
    let result = await generateMFs(mfsArray);
    expect(result[0].mf).toBe('HCl');
    expect(result[0].comment).toBe('YY');
    expect(result).toHaveLength(4);
  });

  it('Range C0-5(+)', async () => {
    let mfsArray = [['C0-5(+)']];
    let result = await generateMFs(mfsArray);
    const mfs = result.map((entry) => entry.mf);
    expect(mfs).toStrictEqual([
      '(+1)',
      'C(+1)',
      'C2(+1)',
      'C3(+1)',
      'C4(+1)',
      'C5(+1)',
    ]);
  });

  it('from array of string with empty', async () => {
    let mfsArray = ['C,H,', 'Cl,Br'];
    const mfs = await generateMFs(mfsArray);
    const result = mfs.map((entry) => entry.mf);
    expect(result).toStrictEqual(['Cl', 'HCl', 'CCl', 'Br', 'HBr', 'CBr']);
  });

  it('from array of string with comment', async () => {
    let mfsArray = ['C.H.O', '+,++', ['Cl', 'Br$XX']];
    const mfs = await generateMFs(mfsArray);
    mfs.sort((a, b) => a.ms.em - b.ms.em);
    expect(mfs[0].mf).toBe('HCl(+2)');
    expect(mfs).toHaveLength(12);
  });

  it('from  array of string with some range and non range', async () => {
    let mfsArray = ['CN0-2'];
    let result = await generateMFs(mfsArray);
    expect(result[0].mf).toBe('C');
    expect(result[1].mf).toBe('CN');
    expect(result[2].mf).toBe('CN2');
    expect(result).toHaveLength(3);
  });

  it('From array of string with some range and non range CN0-2O00-1K', async () => {
    let mfsArray = ['CN0-2O00-1K'];
    let result = await generateMFs(mfsArray);
    expect(result[0].mf).toBe('CK');
    expect(result[1].mf).toBe('CKN');
    expect(result[2].mf).toBe('CKO');
    expect(result[3].mf).toBe('CKN2');
    expect(result[4].mf).toBe('CKNO');
    expect(result[5].mf).toBe('CKN2O');
    expect(result).toHaveLength(6);
  });

  it('From array of string with some range and non range NaK0-2', async () => {
    let mfsArray = ['NaK0-2'];
    let result = await generateMFs(mfsArray);
    expect(result[0].mf).toBe('Na');
    expect(result[1].mf).toBe('KNa');
    expect(result[2].mf).toBe('K2Na');
    expect(result).toHaveLength(3);
  });

  it('From array of string with some range and non range C(Me(N2))0-2(CH3)0-1K', async () => {
    let mfsArray = ['C(Me(N2))0-2(CH3)0-1K'];
    let result = await generateMFs(mfsArray, {
      canonizeMF: false,
      uniqueMFs: false,
    });
    expect(result[0].mf).toBe('CK');
    expect(result[1].mf).toBe('C(CH3)K');
    expect(result[2].mf).toBe('C(Me(N2))K');
    expect(result[3].mf).toBe('C(Me(N2))(CH3)K');
    expect(result[4].mf).toBe('C(Me(N2))2K');
    expect(result[5].mf).toBe('C(Me(N2))2(CH3)K');
    expect(result).toHaveLength(6);
  });

  it('From array of string with some range', async () => {
    let mfsArray = ['C1-3N0-2Cl0-0BrO1-1.C2-3H3-4', ['C', 'O']];
    let result = await generateMFs(mfsArray, { canonizeMF: true });
    expect(result[0].mf).toBe('C3H3');
    expect(result).toHaveLength(26);
  });

  it('From array of string chem em and msem', async () => {
    let mfsArray = ['C0-2.O', ['+', '(-)', '++', '(--)']];

    let result = await generateMFs(mfsArray);
    expect(result[0].mf).toMatch(/^(.*)$/);
    expect(result[0].charge).not.toBe(0);
    expect(result).toHaveLength(16);
  });

  it('From array of string to large array', async () => {
    let mfsArray = ['C0-100', 'O0-100'];
    let result = await generateMFs(mfsArray);
    expect(result).toHaveLength(101 * 101);
  });

  it('From array of string to large array and filter', async () => {
    let mfsArray = ['C0-100', 'O0-100'];
    let result = await generateMFs(mfsArray, {
      filter: { minEM: 0.1, maxEM: 13 },
    });
    expect(result).toHaveLength(1);
  });

  it('filterFct', async () => {
    let mfsArray = [
      { name: 'C', value: 'C0-5' },
      { name: 'D', value: 'O0-5' },
    ];
    let result = await generateMFs(mfsArray, {
      ionizations: '++',
      filterFct: 'C<D && (C+D)===3 && atoms.O>=2',
    });
    expect(result).toHaveLength(2);
  });

  it('From array of string to large array and filter unsaturation', async () => {
    let mfsArray = ['C0-100', 'H0-100'];
    let result = await generateMFs(mfsArray, {
      filter: { unsaturation: { min: 0, max: 1 } },
    });
    expect(result).toHaveLength(151);
  });

  it('Filter callback', async () => {
    let mfsArray = ['C0-4', 'H0-4'];
    let result = await generateMFs(mfsArray, {
      filter: {
        callback: (entry) => {
          if (entry.atoms.C - entry.atoms.H === 0) return true;
          return false;
        },
      },
    });
    expect(result).toHaveLength(4);
  });

  it('From array of string to large array and filter unsaturation min/max and integer unsaturation', async () => {
    let mfsArray = ['C0-100', 'H0-100'];
    let result = await generateMFs(mfsArray, {
      filter: { unsaturation: { min: 0, max: 1, onlyInteger: true } },
    });
    expect(result).toHaveLength(101);
  });

  it('Combine with ionizations', async () => {
    let result = await generateMFs(['C1-2'], { ionizations: 'H+,Na+,H++' });
    expect(result.map((a) => a.ms.em).sort((a, b) => a - b)).toStrictEqual([
      6.50336393620593, 12.503363936205929, 13.00727645232093,
      25.00727645232093, 34.989220702090925, 46.989220702090925,
    ]);
  });

  it('Strange comments', async () => {
    let mfsArray = ['C$1>10', 'O$D2>20'];
    let result = await generateMFs(mfsArray);
    expect(result[0].mf).toBe('CO');
    expect(result[0].comment).toBe('1>10 D2>20');
  });

  it('Check info', async () => {
    let mfsArray = ['C', '', 'C5(C)2'];
    let [result] = await generateMFs(mfsArray, { canonizeMF: true });
    expect(result).toMatchInlineSnapshot(`
      {
        "atoms": {
          "C": 8,
        },
        "charge": 0,
        "em": 96,
        "ionization": {
          "atoms": {},
          "charge": 0,
          "em": 0,
          "mf": "",
        },
        "mf": "C8",
        "ms": {
          "charge": 0,
          "em": 0,
          "ionization": "",
        },
        "mw": 96.08588717388199,
        "parts": [
          "C",
          ,
          "C5(C)2",
        ],
        "unsaturation": 9,
      }
    `);
  });

  it('from array of array with negative ionisation', async () => {
    let mfsArray = ['H2', ['Cl', 'Br']];
    let result = await generateMFs(mfsArray, { ionizations: '(H+)-2' });
    expect(result[0].ms.em).toBe(17.484974920909067);
    expect(result[1].ms.em).toBe(39.45971737990907);
    expect(result).toHaveLength(2);
  });

  it('from array with charge and range', async () => {
    let mfsArray = ['(H+)2-3'];
    let result = await generateMFs(mfsArray, { ionizations: '(H+)-2,Na+' });
    expect(result.map((a) => a.ms.em).sort((a, b) => a - b)).toStrictEqual([
      0, 1.0072764523209299, 6.50276251476343, 8.334591202244264,
    ]);
  });

  it('from array with target masses', async () => {
    let mfsArray = ['C1-100'];
    let result = await generateMFs(mfsArray, {
      ionizations: '+,++',
      filter: {
        targetMasses: [120, 240],
        precision: 10,
        targetIntensities: [1, 5],
      },
    });
    expect(result).toHaveLength(4);
  });

  it('estimate', async () => {
    let mfsArray = ['C1-100', 'Cl,Br,F1-8'];
    let result = await generateMFs(mfsArray, {
      ionizations: '+,++',
      estimate: true,
      filter: {
        targetMasses: [120, 240],
        precision: 10,
        targetIntensities: [1, 5],
      },
    });
    expect(result).toBe(2000);
  });

  it('from array with charge and negative range', async () => {
    let mfsArray = ['(H+)-2--4'];
    let result = await generateMFs(mfsArray, {
      filter: { allowNegativeAtoms: true },
    });
    expect(result.map((a) => a.ms.em).sort((a, b) => a - b)).toStrictEqual([
      -1.0072764523209299, -1.0072764523209299, -1.0072764523209299,
    ]);
  });

  it('with links', async () => {
    const mfsArray = [
      ['C#1', 'C#1C', 'C#2C'],
      ['H#1', 'H#1H', 'H#2'],
    ];

    const mfs = await generateMFs(mfsArray, { links: { filter: true } });
    let result = mfs.map((item) => item.mf);
    expect(result).toStrictEqual(['CH', 'CH2', 'C2H', 'C2H2']);
    const notUniqueMFs = await generateMFs(mfsArray, {
      uniqueMFs: false,
      links: { filter: true },
    });

    result = notUniqueMFs.map((item) => item.mf);
    expect(result).toStrictEqual(['CH', 'CH2', 'C2H', 'C2H', 'C2H2']);
  });

  it('with onStep', async () => {
    let mfsArray = ['C,H', 'Cl,Br'];
    let counter = 0;

    await generateMFs(mfsArray, {
      onStep: () => {
        counter++;
      },
    });
    expect(counter).toBe(3);
  });

  it('Just an array of real MF', async () => {
    const mfsArray = [['C', 'C2', 'C3']];
    const entries = await generateMFs(mfsArray, {
      ionizations: 'H+,(H+)2',
    });
    expect(entries).toHaveLength(6);
  });

  it.skip('check range optimisation', async () => {
    let mfsArray = ['C0-10H0-10C0-10H0-10C0-10'];
    let counter = 0;

    await generateMFs(mfsArray, {
      onStep: () => {
        counter++;
      },
    });
    expect(counter).toBe(650);
  });
});
