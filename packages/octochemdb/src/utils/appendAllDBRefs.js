export function appendAllDBRefs(object, allDBRefs) {
  if (Array.isArray(object)) {
    for (let item of object) {
      appendAllDBRefs(item, allDBRefs);
    }
  } else if (typeof object === 'object' && object !== null) {
    if (object.$ref && object.$id) {
      allDBRefs.push(object);
    }
    for (let key of Object.keys(object)) {
      appendAllDBRefs(object[key], allDBRefs);
    }
  }
}
