import { createArray2d } from '../array';

export default (size) => {
  const values = createArray2d(null, size, size, 0);
  for (let i = 0; i < size; i++) {
    values[i][i] = 1;
  }
  return values;
};
