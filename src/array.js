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
    const ncols = arr[0].length;
    const nrows = arr.length;
    for (let r = 0; r < nrows; r++) {
      for (let c = 0; c < ncols; c++) {
        if (i >= values.length) return;
        arr[r][c] = values[i++];
      }
    }
  } else {
    const l = Math.min(arr.length, values.length);
    for (let c = 0; c < l; c++) {
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

export function createArray1d(values, columns, initValue) {
  if (values) {
    columns = columns > 0 ? columns : values.length;
    const arr = new Array(columns);
    for (let c = 0; c < arr.length; c++) {
      arr[c] = c < values.length ? values[c] : initValue;
    }
    return arr;
  }
  if (columns < 1) throw Error('Columns not a number!');

  return new Array(columns).fill(initValue);
}

export function createArray2d(values, columns, rows, initValue) {
  if (values) {
    if (values.length) {
      rows = Math.ceil(values.length / columns);
    } else if (Number.isFinite(values)) {
      rows = values;
      values = null;
    }
  } else {
    rows = rows || 1;
  }
  if (columns < 1) throw Error('Columns not a number!');
  const arr = new Array(rows);
  if (values) {
    let k = 0;
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(columns);
      for (let j = 0; j < columns; j++) {
        arr[i][j] = k < values.length ? values[k++] : initValue;
      }
    }
  } else {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(columns);
      if (initValue !== undefined) arr[i].fill(initValue);
    }
  }
  return arr;
}
