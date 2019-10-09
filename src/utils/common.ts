/**
 * @description Checking for value
 * @param {*} v - any values
 * @return {Boolean}
 */
const isEmpty = function(v: any): boolean {
  if (v === 0 || v === false) {
    return false;
  }

  // undefined, null, '' are empty
  if (v === undefined || v === null || v === '') {
    return true;
  }

  // {} and [] are empty
  if (typeof v === 'object') {
    // Object.keys({}).length === 0
    // Object.keys([]).length === 0
    // Object.keys([1, 2]).length !== 0
    // Object.keys([null, undefined]).length !== 0
    return Object.keys(v).length === 0;
  }


  return false;
};

const isObject = function(v: any): boolean {
  const type = typeof v;
  return v != null && (type === 'object' || type === 'function');
};

const isRuntime = function(): boolean {
  return typeof global === 'object' && typeof window === 'undefined';
};

export {isEmpty, isObject, isRuntime};

