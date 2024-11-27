import { ensureUppercaseSequence } from 'mf-utilities';

import { aminoAcids } from './aminoAcids';

export function sequenceToMF(mf) {
  if (mf === '') return '';
  mf = ensureUppercaseSequence(mf);
  // this function will check if it is a sequence of aa in 1 letter or 3 letters and convert them if it is the case
  // it could be a multiline mf !
  // if it is a multiline we could make some "tricks" ...

  let newMF = mf;
  // SEQRES   1 B  256  MET PRO VAL GLU ILE THR VAL LYS GLU LEU LEU GLU ALA
  // SEQRES   2 B  256  GLY VAL HIS PHE GLY HIS GLU ARG LYS ARG TRP ASN PRO
  // or
  // MET PRO VAL GLU ILE THR VAL LYS GLU LEU LEU GLU ALA
  // GLY VAL HIS PHE GLY HIS GLU ARG LYS ARG TRP ASN PRO
  if (mf.search(/(?:[A-Z]{3} ){2}[A-Z]{3}/) > -1) {
    // this is a PDB !
    let tmpmf = mf.replaceAll(/[\n\r]+/g, ' ');
    tmpmf = tmpmf.replaceAll(/(SEQRES|\d+| [A-Z] | [\dA-Z]{4-50})/g, '');
    // we need to correct the uppercase / lowercase
    let parts = tmpmf.split(' ');
    newMF = 'H';
    for (let i = 0; i < parts.length; i++) {
      newMF += parts[i].slice(0, 1) + parts[i].slice(1).toLowerCase();
    }
    newMF += 'OH';
  } else if (mf.includes('(') && isOneLetterCode(mf)) {
    // we expect one-letter code with modification
    newMF = '';
    let nTerminal = 'H';
    let cTerminal = 'OH';
    let parenthesisCounter = 0;
    for (let i = 0; i < mf.length; i++) {
      let currentSymbol = mf[i];
      if (
        currentSymbol === '(' ||
        currentSymbol === ')' ||
        parenthesisCounter > 0
      ) {
        if (currentSymbol === '(') {
          parenthesisCounter++;
          if (i === 0) nTerminal = '';
        }
        if (currentSymbol === ')') {
          parenthesisCounter--;
          if (i === mf.length - 1) cTerminal = '';
        }
        newMF += currentSymbol;
        continue;
      }
      newMF += convertAA1To3(currentSymbol);
    }
    newMF = nTerminal + newMF + cTerminal;
  } else if (mf.search(/[A-Za-z][\da-z]/) === -1) {
    // UNIPROT
    //   370        380        390        400        410        420
    //GFKPNLRKTF VSGLFRESCG AHFYRGVDVK PFYIKKPVDN LFALMLILNR LRGWGVVGGM
    //
    //    430        440        450        460        470        480
    //SDPRLYKVWV RLSSQVPSMF FGGTDLAADY YVVSPPTAVS VYTKTPYGRL LADTRTSGFR
    // We remove all the number, all the spaces, etc
    newMF = `H${convertAA1To3(newMF.replaceAll(/[^A-Z]/g, ''))}OH`;
  }

  return newMF;
}

function convertAA1To3(mf) {
  let newmf = '';
  for (let i = 0; i < mf.length; i++) {
    newmf += aa1To3(mf.charAt(i));
  }
  return newmf;
}

function aa1To3(code) {
  for (let i = 0; i < aminoAcids.length; i++) {
    if (aminoAcids[i].aa1 === code) {
      return aminoAcids[i].aa3;
    }
  }
  throw new Error(`Invalid 1 letter code: ${code}`);
}

// mf can contain as well parenthesis. We need to check if it is not yet a correct molecular formula
function isOneLetterCode(mf) {
  let parenthesisLevel = 0;
  for (let char of mf) {
    if (parenthesisLevel === 0 && char.match(/[a-z]/)) return false;
    if (char === '(') parenthesisLevel++;
    if (char === ')') parenthesisLevel--;
  }
  return true;
}
