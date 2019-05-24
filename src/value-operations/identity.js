export default (size, op) => {
  const values = new Array(size);
  for (let r = 0, c = 0; r < size; r++, c++) {
    values[r] = new Array(size).fill(op.zero());
    values[r][c] = op.identity();
  }
  return values;
};
