import { ncols, clone, removeFrom } from '../array';

function determinantRec(m) {
  if (m.length === 1) return m[0][0];

  let d = 0;
  const cols = ncols(m);
  for (let c = 0; c < cols; c++) {
    const v = m[0][c];
    if (v === 0) continue;
    const sm = clone(m);
    removeFrom(sm, 1, c + 1);
    let cofactor = determinantRec(sm);

    if (c % 2 === 1) {
      cofactor = -cofactor;
    }
    d += v * cofactor;
  }
  return d;
}

export function determinant2d(v) {
  return v[0][0] * v[1][1] - v[0][1] * v[1][0];
}

export function determinant3d(v) {
  return v[0][0] * v[1][1] * v[2][2] +
    v[0][1] * v[1][2] * v[2][0] +
    v[0][2] * v[1][0] * v[2][1] -
    v[0][0] * v[1][2] * v[2][1] -
    v[0][1] * v[1][0] * v[2][2] -
    v[0][2] * v[1][1] * v[2][0];
}

export function determinant4d(v) {
  const value =
    v[0][3] * v[1][2] * v[2][1] * v[3][0] -
    v[0][2] * v[1][3] * v[2][1] * v[3][0] -
    v[0][3] * v[1][1] * v[2][2] * v[3][0] +
    v[0][1] * v[1][3] * v[2][2] * v[3][0] +
    v[0][2] * v[1][1] * v[2][3] * v[3][0] -
    v[0][1] * v[1][2] * v[2][3] * v[3][0] -
    v[0][3] * v[1][2] * v[2][0] * v[3][1] +
    v[0][2] * v[1][3] * v[2][0] * v[3][1] +
    v[0][3] * v[1][0] * v[2][2] * v[3][1] -
    v[0][0] * v[1][3] * v[2][2] * v[3][1] -
    v[0][2] * v[1][0] * v[2][3] * v[3][1] +
    v[0][0] * v[1][2] * v[2][3] * v[3][1] +
    v[0][3] * v[1][1] * v[2][0] * v[3][2] -
    v[0][1] * v[1][3] * v[2][0] * v[3][2] -
    v[0][3] * v[1][0] * v[2][1] * v[3][2] +
    v[0][0] * v[1][3] * v[2][1] * v[3][2] +
    v[0][1] * v[1][0] * v[2][3] * v[3][2] -
    v[0][0] * v[1][1] * v[2][3] * v[3][2] -
    v[0][2] * v[1][1] * v[2][0] * v[3][3] +
    v[0][1] * v[1][2] * v[2][0] * v[3][3] +
    v[0][2] * v[1][0] * v[2][1] * v[3][3] -
    v[0][0] * v[1][2] * v[2][1] * v[3][3] -
    v[0][1] * v[1][0] * v[2][2] * v[3][3] +
    v[0][0] * v[1][1] * v[2][2] * v[3][3];
  return value;
}

export default function determinant(m) {
  if (m.rows === 1) {
    return m._values[0];
  } else if (m.rows === 2 && m._optimise) {
    return determinant2d(m._values);
  } else if (m.rows === 3 && m._optimise) {
    return determinant3d(m._values);
  } else if (m.rows === 4 && m._optimise) {
    return determinant4d(m._values);
  }
  return determinantRec(m._values);
}
