import { elementsObject } from 'chemical-elements';
import { groupsObject } from 'chemical-groups';

export function isMF(mf) {
  let tmpMF = mf.replace(/[^a-zA-Z]/g, '');
  let parts = tmpMF.replace(/([A-Za-z])(?=[A-Z])/g, '$1 ').split(' ');
  for (let i = 0; i < parts.length; i++) {
    if (!elementsObject[parts[i]] && !groupsObject[parts[i]]) {
      return false;
    }
  }

  return true;
}
