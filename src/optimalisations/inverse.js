import identityMatrix from './identity';

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