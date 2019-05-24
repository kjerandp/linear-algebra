import Array2d from '../array-2d';

function dotProduct(a1, a2, op) {
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
    let sum = op.zero();
    for (let n = 0; n < a1.cols; n++) {
      sum = op.add(sum, op.multiply(a1.getValueAt(n, r), a2.getValueAt(c, n)));
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

export default dotProduct;
