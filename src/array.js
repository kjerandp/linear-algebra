export function createArray1d(values, columns, initValue) {
  if (values && values.length) {
    columns = columns > 0 ? columns : values.length;
  }
  if (columns < 1) throw Error('Columns not a number!');
  const arr = new Array(columns);
  let c = 0;
  if (values) {
    const itr = Math.min(values.length, columns);
    for (; c < itr; c++) {
      arr[c] = values[c];
    }
  }
  for (; c < columns; c++) {
    arr[c] = initValue;
  }
  return arr;
}

export function createArray2d(values, columns, rows, initValue) {
  if (values && values.length) {
    rows = Math.ceil(values.length / columns);
  }
  if (Number.isFinite(values)) {
    rows = values;
    values = null;
  }
  if (columns < 1) throw Error('Columns not a number!');
  rows = rows || 1;
  const arr = new Array(rows);
  const len = rows * columns;
  let i = 0;
  let r = -1;
  if (values) {
    const itr = Math.min(len, values.length);
    for (; i < itr; i++) {
      const c = i % columns;
      if (c === 0) {
        r++;
        arr[r] = new Array(columns);
      }
      arr[r][c] = values[i];
    }
  }
  for (; i < len; i++) {
    const c = i % columns;
    if (c === 0) {
      r++;
      arr[r] = new Array(columns);
    }
    arr[r][c] = initValue;
  }

  // for (let r = 0; r < arr.length; r++) {
  //   arr[r] = new Array(columns);
  //   for (let c = 0; c < columns; c++) {
  //     arr[r][c] = values[i++];
  //   }
  //   for (let c = i; c < columns; c++) {
  //     arr[r][c] = initValue;
  //   }
  // }
  return arr;
}

export function assignTo(arr, cb) {
  if (Array.isArray(arr[0])) {
    for (let r = 0; r < arr.length; r++) {
      for (let c = 0; c < arr[r].length; c++) {
        arr[r][c] = cb(arr[r][c], c, r);
      }
    }
  } else {
    for (let c = 0; c < arr.length; c++) {
      arr[c] = cb(arr[c], c);
    }
  }
}

export function copyTo(arr, values) {
  if (Array.isArray(arr[0])) {
    let i = 0;
    for (let r = 0; r < arr.length; r++) {
      for (let c = 0; c < arr[0].length && i < values.length; c++) {
        arr[r][c] = values[i++];
      }
    }
  } else {
    for (let c = 0; c < arr.length && c < values.length; c++) {
      arr[c] = values[c];
    }
  }
}

export function transpose(arr) {
  const ncols = arr[0].length;
  const nrows = arr.length;

  const cols = new Array(ncols);

  for (let r = 0; r < nrows; r++) {
    for (let c = 0; c < ncols; c++) {
      if (cols[c] === undefined) {
        cols[c] = new Array(nrows);
      }
      cols[c][r] = arr[r][c];
    }
  }
  return cols;
}

export function subArrayFrom(arr, i = 1, j = 1, rows = 2, cols = 2) {
  if (rows < 1 || cols < 1 || i < 1 || j < 1)
    throw Error('Invalid arguments!');

  const sub = new Array(rows);

  for (let r = 0; r < rows; r++) {
    sub[r] = new Array(cols);
    for (let c = 0; c < cols; c++) {
      sub[r][c] = arr[i - 1 + r][j - 1 + c];
    }
  }
  return sub;
}

export function removeFrom(arr, i = 0, j = 0) {
  if (!i && !j) return;

  if (i > arr.length || j > arr[0].length)
    throw Error('Invalid arguments!');

  if (i > 0) {
    arr.splice(i - 1, 1);
  }

  if (j > 0) {
    arr.forEach(row => row.splice(j - 1, 1));
  }
}

export function clone(arr) {
  return Array.isArray(arr[0]) ? arr.map(row => row.slice()) : arr.slice();
}

export const nrows = arr => arr.length;

export const ncols = arr => arr && arr[0].length;

export const flatten = (inpArr) => {
  const arr = new Array(inpArr.length * inpArr[0].length);
  for (let r = 0; r < inpArr.length; r++) {
    const ri = r * inpArr[0].length;
    for (let c = 0; c < inpArr[0].length; c++) {
      arr[ri + c] = inpArr[r][c];
    }
  }
  return arr;
};
