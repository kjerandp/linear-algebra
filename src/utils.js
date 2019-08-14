/**
 * Transpose a single dimensional array, representing 2d data, from
 * rows first to columns first.
 * @param {number[]} arr Array to transpose
 * @param {number} cols Number of columns in source array
 * @param {number[]} target If omitted, result will be returned as a new array
 */
export function rowsToColumns(arr, cols, target = null) {
  cols = cols || 1;
  const rows = cols === 1 ? arr.length : ~~(arr.length / cols);

  if (target) {
    if (target === arr) {
      arr = [...arr]; // copy
    }
  } else {
    target = new Array(rows * cols);
  }

  let n = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      target[rows * j + i] = arr[n++];
    }
  }
  return target;
}

/**
 * Recursive function used by flattenList
 * @param {number[]} array array to be flattended
 * @param {number[]} flattend resulting array of values
 * @param {number} max max returned values (default is 0 for all)
 */
function flatRec(array, flattend, max) {
  for (let i = 0; i < array.length; i++) {
    if (max && flattend.length === max) return;
    const el = array[i];
    if (Array.isArray(el)) flatRec(el, flattend, max);
    else flattend.push(el);
  }
}

/**
 * Recursivly flattens a list of arguments to a 1 dimensional array
 * @param {number[]} arg Arguments to be flattended
 * @param {number[]} flattend Resulting array of values
 * @param {number} max Max returned values (default is 0 for all)
 */
export function flattenList(arg = [], flattend = [], max = 0) {
  if (flattend.length > 0) flattend.length = 0;
  flatRec(arg, flattend, max);
  return flattend;
}

