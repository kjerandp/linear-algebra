import Array2d from '../array-2d';

export default (size, op) => {
  const values = new Array2d(null, size, size, op.zero());
  for (let i = 0; i < size; i++) {
    values.setValueAt(i, i, op.identity());
  }
  return values;
};
