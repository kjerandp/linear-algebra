import { cols, rows, createArray2d } from '../array';

function dotProduct(a1, a2, op) {
  if (cols(a1) !== rows(a2))
    throw Error('The number of columns of the left hand must be the same as the number of rows of the right hand!');

  const nrows = rows(a1);
  const ncols = cols(a2);

  const calc = (c, r) => {
    let sum = op.zero();
    for (let n = 0; n < cols(a1); n++) {
      sum = op.add(sum, op.multiply(a1[r][n], a2[n][c]));
    }
    return sum;
  };

  const len = nrows * ncols;
  if (len === 1) {
    return calc(0, 0);
  }

  const res = createArray2d(nrows, ncols);

  for (let r = 0; r < nrows; r++) {
    for (let c = 0; c < ncols; c++) {
      res[r][c] = calc(c, r);
    }
  }
  return res;
}

export default dotProduct;
