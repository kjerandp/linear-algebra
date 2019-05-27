function dotProduct(a1, a2) {
  if (a1[0].length !== a2.length)
    throw Error(
      'The number of columns of the left matrix must be the same as the number of rows of the right matrix!',
    );

  const rows = a1.length;
  const cols = a2[0].length;

  const v = new Array(rows);
  for (let r = 0; r < rows; r++) {
    v[r] = new Array(cols);
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
export default dotProduct;
