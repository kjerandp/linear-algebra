/**
 * Optimisations of matrix operations for special cases
 */

/* eslint-disable max-len */

export function determinant2d(v) {
  return v[0][0] * v[1][1] - v[0][1] * v[1][0];
}

// not optimal so not used
export function inverse2d(v) {
  const i = new Array(2);
  i[0] = new Array(2);
  i[1] = new Array(2);
  const d = determinant2d(v);

  if (d === 0) return null;

  const s = 1 / d;

  i[0][0] = v[1][1] * s;
  i[0][1] = -v[0][1] * s;
  i[0][2] = -v[1][0] * s;
  i[0][3] = v[0][0] * s;

  return i;
}

export function determinant3d(v) {
  return v[0][0] * v[1][1] * v[2][2] + v[0][1] * v[1][2] * v[2][0] + v[0][2] * v[1][0] * v[2][1] - v[0][0] * v[1][2] * v[2][1] - v[0][1] * v[1][0] * v[2][2] - v[0][2] * v[1][1] * v[2][0];
}

// not optimal so not used
export function inverse3d(v) {
  const i = new Array(3);
  i[0] = new Array(3);
  i[1] = new Array(3);
  i[2] = new Array(3);
  const d = determinant3d(v);

  if (d === 0) return null;

  const s = 1 / d;

  i[0][0] = s * ((v[1][1] * v[2][2] - v[1][2] * v[2][1]));
  i[0][1] = s * ((v[0][2] * v[2][1] - v[0][1] * v[2][2]));
  i[0][2] = s * ((v[0][1] * v[1][2] - v[0][2] * v[1][1]));
  i[1][0] = s * ((v[1][2] * v[2][0] - v[1][0] * v[2][2]));
  i[1][1] = s * ((v[0][0] * v[2][2] - v[0][2] * v[2][0]));
  i[1][2] = s * ((v[0][2] * v[1][0] - v[0][0] * v[1][2]));
  i[2][0] = s * ((v[1][0] * v[2][1] - v[1][1] * v[2][0]));
  i[2][1] = s * ((v[0][1] * v[2][0] - v[0][0] * v[2][1]));
  i[2][2] = s * ((v[0][0] * v[1][1] - v[0][1] * v[1][0]));

  return i;
}

export function determinant4d(v) {
  const value =
    v[0][3] * v[1][2] * v[2][1] * v[3][0] - v[0][2] * v[1][3] * v[2][1] * v[3][0] - v[0][3] * v[1][1] * v[2][2] * v[3][0] + v[0][1] * v[1][3] * v[2][2] * v[3][0] +
    v[0][2] * v[1][1] * v[2][3] * v[3][0] - v[0][1] * v[1][2] * v[2][3] * v[3][0] - v[0][3] * v[1][2] * v[2][0] * v[3][1] + v[0][2] * v[1][3] * v[2][0] * v[3][1] +
    v[0][3] * v[1][0] * v[2][2] * v[3][1] - v[0][0] * v[1][3] * v[2][2] * v[3][1] - v[0][2] * v[1][0] * v[2][3] * v[3][1] + v[0][0] * v[1][2] * v[2][3] * v[3][1] +
    v[0][3] * v[1][1] * v[2][0] * v[3][2] - v[0][1] * v[1][3] * v[2][0] * v[3][2] - v[0][3] * v[1][0] * v[2][1] * v[3][2] + v[0][0] * v[1][3] * v[2][1] * v[3][2] +
    v[0][1] * v[1][0] * v[2][3] * v[3][2] - v[0][0] * v[1][1] * v[2][3] * v[3][2] - v[0][2] * v[1][1] * v[2][0] * v[3][3] + v[0][1] * v[1][2] * v[2][0] * v[3][3] +
    v[0][2] * v[1][0] * v[2][1] * v[3][3] - v[0][0] * v[1][2] * v[2][1] * v[3][3] - v[0][1] * v[1][0] * v[2][2] * v[3][3] + v[0][0] * v[1][1] * v[2][2] * v[3][3];
  return value;
}

// not optimal so not used
export function inverse4d(v) {
  const i = new Array(4);
  i[0] = new Array(4);
  i[1] = new Array(4);
  i[2] = new Array(4);
  i[3] = new Array(4);
  const d = determinant4d(v);

  if (d === 0) return null;

  const s = 1 / d;

  i[0][0] = s * (v[1][2] * v[2][3] * v[3][1] - v[1][3] * v[2][2] * v[3][1] + v[1][3] * v[2][1] * v[3][2] - v[1][1] * v[2][3] * v[3][2] - v[1][2] * v[2][1] * v[3][3] + v[1][1] * v[2][2] * v[3][3]);
  i[0][1] = s * (v[0][3] * v[2][2] * v[3][1] - v[0][2] * v[2][3] * v[3][1] - v[0][3] * v[2][1] * v[3][2] + v[0][1] * v[2][3] * v[3][2] + v[0][2] * v[2][1] * v[3][3] - v[0][1] * v[2][2] * v[3][3]);
  i[0][2] = s * (v[0][2] * v[1][3] * v[3][1] - v[0][3] * v[1][2] * v[3][1] + v[0][3] * v[1][1] * v[3][2] - v[0][1] * v[1][3] * v[3][2] - v[0][2] * v[1][1] * v[3][3] + v[0][1] * v[1][2] * v[3][3]);
  i[0][3] = s * (v[0][3] * v[1][2] * v[2][1] - v[0][2] * v[1][3] * v[2][1] - v[0][3] * v[1][1] * v[2][2] + v[0][1] * v[1][3] * v[2][2] + v[0][2] * v[1][1] * v[2][3] - v[0][1] * v[1][2] * v[2][3]);
  i[1][0] = s * (v[1][3] * v[2][2] * v[3][0] - v[1][2] * v[2][3] * v[3][0] - v[1][3] * v[2][0] * v[3][2] + v[1][0] * v[2][3] * v[3][2] + v[1][2] * v[2][0] * v[3][3] - v[1][0] * v[2][2] * v[3][3]);
  i[1][1] = s * (v[0][2] * v[2][3] * v[3][0] - v[0][3] * v[2][2] * v[3][0] + v[0][3] * v[2][0] * v[3][2] - v[0][0] * v[2][3] * v[3][2] - v[0][2] * v[2][0] * v[3][3] + v[0][0] * v[2][2] * v[3][3]);
  i[1][2] = s * (v[0][3] * v[1][2] * v[3][0] - v[0][2] * v[1][3] * v[3][0] - v[0][3] * v[1][0] * v[3][2] + v[0][0] * v[1][3] * v[3][2] + v[0][2] * v[1][0] * v[3][3] - v[0][0] * v[1][2] * v[3][3]);
  i[1][3] = s * (v[0][2] * v[1][3] * v[2][0] - v[0][3] * v[1][2] * v[2][0] + v[0][3] * v[1][0] * v[2][2] - v[0][0] * v[1][3] * v[2][2] - v[0][2] * v[1][0] * v[2][3] + v[0][0] * v[1][2] * v[2][3]);
  i[2][0] = s * (v[1][1] * v[2][3] * v[3][0] - v[1][3] * v[2][1] * v[3][0] + v[1][3] * v[2][0] * v[3][1] - v[1][0] * v[2][3] * v[3][1] - v[1][1] * v[2][0] * v[3][3] + v[1][0] * v[2][1] * v[3][3]);
  i[2][1] = s * (v[0][3] * v[2][1] * v[3][0] - v[0][1] * v[2][3] * v[3][0] - v[0][3] * v[2][0] * v[3][1] + v[0][0] * v[2][3] * v[3][1] + v[0][1] * v[2][0] * v[3][3] - v[0][0] * v[2][1] * v[3][3]);
  i[2][2] = s * (v[0][1] * v[1][3] * v[3][0] - v[0][3] * v[1][1] * v[3][0] + v[0][3] * v[1][0] * v[3][1] - v[0][0] * v[1][3] * v[3][1] - v[0][1] * v[1][0] * v[3][3] + v[0][0] * v[1][1] * v[3][3]);
  i[2][3] = s * (v[0][3] * v[1][1] * v[2][0] - v[0][1] * v[1][3] * v[2][0] - v[0][3] * v[1][0] * v[2][1] + v[0][0] * v[1][3] * v[2][1] + v[0][1] * v[1][0] * v[2][3] - v[0][0] * v[1][1] * v[2][3]);
  i[3][0] = s * (v[1][2] * v[2][1] * v[3][0] - v[1][1] * v[2][2] * v[3][0] - v[1][2] * v[2][0] * v[3][1] + v[1][0] * v[2][2] * v[3][1] + v[1][1] * v[2][0] * v[3][2] - v[1][0] * v[2][1] * v[3][2]);
  i[3][1] = s * (v[0][1] * v[2][2] * v[3][0] - v[0][2] * v[2][1] * v[3][0] + v[0][2] * v[2][0] * v[3][1] - v[0][0] * v[2][2] * v[3][1] - v[0][1] * v[2][0] * v[3][2] + v[0][0] * v[2][1] * v[3][2]);
  i[3][2] = s * (v[0][2] * v[1][1] * v[3][0] - v[0][1] * v[1][2] * v[3][0] - v[0][2] * v[1][0] * v[3][1] + v[0][0] * v[1][2] * v[3][1] + v[0][1] * v[1][0] * v[3][2] - v[0][0] * v[1][1] * v[3][2]);
  i[3][3] = s * (v[0][1] * v[1][2] * v[2][0] - v[0][2] * v[1][1] * v[2][0] + v[0][2] * v[1][0] * v[2][1] - v[0][0] * v[1][2] * v[2][1] - v[0][1] * v[1][0] * v[2][2] + v[0][0] * v[1][1] * v[2][2]);

  return i;
}
