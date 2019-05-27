import identityMatrix from './identity';
import {
  determinant2d,
  determinant3d,
  determinant4d,
} from './determinant';

export default (arr) => {
  const dim = arr.length;
  const res = identityMatrix(dim);

  for (let i = 0; i < dim; i++) {
    let e = arr[i][i];
    // if we have a 0 on the diagonal (we'll need to swap with a lower row)
    if (e === 0) {
      // look through every row below the i'th row
      for (let ii = i + 1; ii < dim; ii += 1) {
        // if the ii'th row has a non-0 in the i'th col
        if (arr[ii][i] !== 0) {
          // it would make the diagonal have a non-0 so swap it
          for (let j = 0; j < dim; j++) {
            e = arr[i][j]; // temp store i'th row
            arr[i][j] = arr[ii][j]; // replace i'th row by ii'th
            arr[ii][j] = e; // repace ii'th by temp
            e = res[i][j]; // temp store i'th row
            res[i][j] = res[ii][j]; // replace i'th row by ii'th
            res[ii][j] = e; // repace ii'th by temp
          }
          // don't bother checking other rows since we've swapped
          break;
        }
      }
      // get the new diagonal
      e = arr[i][i];
      // if it's still 0, not invertable (error)
      if (e === 0) return undefined;
    }

    // Scale this row down by e (so we have a 1 on the diagonal)
    for (let j = 0; j < dim; j++) {
      arr[i][j] /= e; // apply to original matrix
      res[i][j] /= e; // apply to identity
    }

    // Subtract this row (scaled appropriately for each row) from ALL of
    // the other rows so that there will be 0's in this column in the
    // rows above and below this one
    for (let ii = 0; ii < dim; ii++) {
      // Only apply to other rows (we want a 1 on the diagonal)
      if (ii === i) continue;

      // We want to change this element to 0
      e = arr[ii][i];

      // Subtract (the row above(or below) scaled by e) from (the
      // current row) but start at the i'th column and assume all the
      // stuff left of diagonal is 0 (which it should be if we made this
      // algorithm correctly)
      for (let j = 0; j < dim; j++) {
        arr[ii][j] -= e * arr[i][j]; // apply to original matrix
        res[ii][j] -= e * res[i][j]; // apply to identity
      }
    }
  }

  return res;
};

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

  i[0][0] = s * (
    v[1][2] * v[2][3] * v[3][1] - v[1][3] * v[2][2] * v[3][1] + v[1][3] * v[2][1] * v[3][2] -
    v[1][1] * v[2][3] * v[3][2] - v[1][2] * v[2][1] * v[3][3] + v[1][1] * v[2][2] * v[3][3]
  );
  i[0][1] = s * (
    v[0][3] * v[2][2] * v[3][1] - v[0][2] * v[2][3] * v[3][1] - v[0][3] * v[2][1] * v[3][2] +
    v[0][1] * v[2][3] * v[3][2] + v[0][2] * v[2][1] * v[3][3] - v[0][1] * v[2][2] * v[3][3]
  );
  i[0][2] = s * (
    v[0][2] * v[1][3] * v[3][1] - v[0][3] * v[1][2] * v[3][1] + v[0][3] * v[1][1] * v[3][2] -
    v[0][1] * v[1][3] * v[3][2] - v[0][2] * v[1][1] * v[3][3] + v[0][1] * v[1][2] * v[3][3]
  );
  i[0][3] = s * (
    v[0][3] * v[1][2] * v[2][1] - v[0][2] * v[1][3] * v[2][1] - v[0][3] * v[1][1] * v[2][2] +
    v[0][1] * v[1][3] * v[2][2] + v[0][2] * v[1][1] * v[2][3] - v[0][1] * v[1][2] * v[2][3]
  );
  i[1][0] = s * (
    v[1][3] * v[2][2] * v[3][0] - v[1][2] * v[2][3] * v[3][0] - v[1][3] * v[2][0] * v[3][2] +
    v[1][0] * v[2][3] * v[3][2] + v[1][2] * v[2][0] * v[3][3] - v[1][0] * v[2][2] * v[3][3]
  );
  i[1][1] = s * (
    v[0][2] * v[2][3] * v[3][0] - v[0][3] * v[2][2] * v[3][0] + v[0][3] * v[2][0] * v[3][2] -
    v[0][0] * v[2][3] * v[3][2] - v[0][2] * v[2][0] * v[3][3] + v[0][0] * v[2][2] * v[3][3]
  );
  i[1][2] = s * (
    v[0][3] * v[1][2] * v[3][0] - v[0][2] * v[1][3] * v[3][0] - v[0][3] * v[1][0] * v[3][2] +
    v[0][0] * v[1][3] * v[3][2] + v[0][2] * v[1][0] * v[3][3] - v[0][0] * v[1][2] * v[3][3]
  );
  i[1][3] = s * (
    v[0][2] * v[1][3] * v[2][0] - v[0][3] * v[1][2] * v[2][0] + v[0][3] * v[1][0] * v[2][2] -
    v[0][0] * v[1][3] * v[2][2] - v[0][2] * v[1][0] * v[2][3] + v[0][0] * v[1][2] * v[2][3]
  );
  i[2][0] = s * (
    v[1][1] * v[2][3] * v[3][0] - v[1][3] * v[2][1] * v[3][0] + v[1][3] * v[2][0] * v[3][1] -
    v[1][0] * v[2][3] * v[3][1] - v[1][1] * v[2][0] * v[3][3] + v[1][0] * v[2][1] * v[3][3]
  );
  i[2][1] = s * (
    v[0][3] * v[2][1] * v[3][0] - v[0][1] * v[2][3] * v[3][0] - v[0][3] * v[2][0] * v[3][1] +
    v[0][0] * v[2][3] * v[3][1] + v[0][1] * v[2][0] * v[3][3] - v[0][0] * v[2][1] * v[3][3]
  );
  i[2][2] = s * (
    v[0][1] * v[1][3] * v[3][0] - v[0][3] * v[1][1] * v[3][0] + v[0][3] * v[1][0] * v[3][1] -
    v[0][0] * v[1][3] * v[3][1] - v[0][1] * v[1][0] * v[3][3] + v[0][0] * v[1][1] * v[3][3]
  );
  i[2][3] = s * (
    v[0][3] * v[1][1] * v[2][0] - v[0][1] * v[1][3] * v[2][0] - v[0][3] * v[1][0] * v[2][1] +
    v[0][0] * v[1][3] * v[2][1] + v[0][1] * v[1][0] * v[2][3] - v[0][0] * v[1][1] * v[2][3]
  );
  i[3][0] = s * (
    v[1][2] * v[2][1] * v[3][0] - v[1][1] * v[2][2] * v[3][0] - v[1][2] * v[2][0] * v[3][1] +
    v[1][0] * v[2][2] * v[3][1] + v[1][1] * v[2][0] * v[3][2] - v[1][0] * v[2][1] * v[3][2]
  );
  i[3][1] = s * (
    v[0][1] * v[2][2] * v[3][0] - v[0][2] * v[2][1] * v[3][0] + v[0][2] * v[2][0] * v[3][1] -
    v[0][0] * v[2][2] * v[3][1] - v[0][1] * v[2][0] * v[3][2] + v[0][0] * v[2][1] * v[3][2]
  );
  i[3][2] = s * (
    v[0][2] * v[1][1] * v[3][0] - v[0][1] * v[1][2] * v[3][0] - v[0][2] * v[1][0] * v[3][1] +
    v[0][0] * v[1][2] * v[3][1] + v[0][1] * v[1][0] * v[3][2] - v[0][0] * v[1][1] * v[3][2]
  );
  i[3][3] = s * (
    v[0][1] * v[1][2] * v[2][0] - v[0][2] * v[1][1] * v[2][0] + v[0][2] * v[1][0] * v[2][1] -
    v[0][0] * v[1][2] * v[2][1] - v[0][1] * v[1][0] * v[2][2] + v[0][0] * v[1][1] * v[2][2]
  );

  return i;
}
