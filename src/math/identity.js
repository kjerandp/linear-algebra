import { createArray2d } from '../array';

export default op => (size) => {
  const values = createArray2d(null, size, size, op.zero());
  for (let i = 0; i < size; i++) {
    values[i][i] = op.identity();
  }
  return values;
};
