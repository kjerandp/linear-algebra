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
