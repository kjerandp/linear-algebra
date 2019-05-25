import identityMatrix from './identity';
import { rows } from '../array';

export default (m, op) => {
  const dim = rows(m);
  const r = identityMatrix(dim, op);

  for (let i = 0; i < dim; i++) {
    let e = m[i][i];
    // if we have a 0 on the diagonal (we'll need to swap with a lower row)
    if (op.isZero(e)) {
      // look through every row below the i'th row
      for (let ii = i + 1; ii < dim; ii += 1) {
        // if the ii'th row has a non-0 in the i'th col
        if (!op.isZero(m[ii][i])) {
          // it would make the diagonal have a non-0 so swap it
          for (let j = 0; j < dim; j++) {
            e = m[i][j]; // temp store i'th row
            m[i][j] = m[ii][j]; // replace i'th row by ii'th
            m[ii][j] = e; // repace ii'th by temp
            e = r[i][j]; // temp store i'th row
            r[i][j] = r[ii][j]; // replace i'th row by ii'th
            r[ii][j] = e; // repace ii'th by temp
          }
          // don't bother checking other rows since we've swapped
          break;
        }
      }
      // get the new diagonal
      e = m[i][i];
      // if it's still 0, not invertable (error)
      if (op.isZero(e)) throw Error('Not invertable!');
    }

    // Scale this row down by e (so we have a 1 on the diagonal)
    for (let j = 0; j < dim; j++) {
      m[i][j] = op.divide(m[i][j], e); // apply to original matrix
      r[i][j] = op.divide(r[i][j], e); // apply to identity
    }

    // Subtract this row (scaled appropriately for each row) from ALL of
    // the other rows so that there will be 0's in this column in the
    // rows above and below this one
    for (let ii = 0; ii < dim; ii++) {
      // Only apply to other rows (we want a 1 on the diagonal)
      if (ii === i) continue;

      // We want to change this element to 0
      e = m[ii][i];

      // Subtract (the row above(or below) scaled by e) from (the
      // current row) but start at the i'th column and assume all the
      // stuff left of diagonal is 0 (which it should be if we made this
      // algorithm correctly)
      for (let j = 0; j < dim; j++) {
        m[ii][j] = op.subtract(m[ii][j], op.multiply(e, m[i][j])); // apply to original matrix
        r[ii][j] = op.subtract(r[ii][j], op.multiply(e, r[i][j])); // apply to identity
      }
    }
  }
  return r;
};
