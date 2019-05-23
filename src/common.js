import Array2d from './array-2d';

export function dotArrays(a1, a2) {
  if (a1[0].length !== a2.length)
    throw Error(
      'The number of columns of the left matrix must be the same as the number of rows of the right matrix!',
    );

  const rows = a1.length;
  const cols = a2[0].length;

  const v = new Array(rows);
  for (let r = 0; r < rows; r++) {
    v[r] = new Array(cols).fill(0);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let sum = 0;
      for (let n = 0; n < a1[0].length; n++) {
        sum += a1[r][n] * a2[n][c];
      }
      v[r][c] = sum;
    }
  }

  return v;
}

export function dotArrays2(a1, a2) {
  if (!(a1 instanceof Array2d)) {
    if (!Array.isArray(a1))
      throw Error('Argument 1 is not an Array type!');
    a1 = new Array2d(a1);
  }
  if (!(a2 instanceof Array2d)) {
    if (!Array.isArray(a2))
      throw Error('Argument 2 is not an Array type!');
    a2 = new Array2d(a2);
  }

  if (a1.cols !== a2.rows)
    throw Error('The number of columns of the left hand must be the same as the number of rows of the right hand!');

  const { rows } = a1;
  const { cols } = a2;

  const calc = (c, r) => {
    let sum = 0;
    for (let n = 0; n < a1.cols; n++) {
      sum += a1.getValueAt(n, r) * a2.getValueAt(c, n);
    }
    return sum;
  };

  const len = rows * cols;
  if (len === 1) {
    return calc(0, 0);
  }

  const res = new Array2d(len, cols);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      res.setValueAt(c, r, calc(c, r));
    }
  }
  return res;
}

export function clampValue(v, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

export function mixValue(a, b, t) {
  const m = clampValue(t);
  return a * (1 - m) + b * m;
}

export function stepValue(edge, x) {
  return x >= edge ? 1 : 0;
}

export function smoothstepValue(edge0, edge1, x) {
  const t = clampValue((x - edge0) / (edge1 - edge0));
  return t * t * (3.0 - 2.0 * t);
}
