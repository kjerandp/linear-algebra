import { ncols, clone, removeFrom } from '../array';

export default op => function determinant(m) {
  if (m.length === 1) return m[0][0];

  let d = op.zero();
  const cols = ncols(m);
  for (let c = 0; c < cols; c++) {
    const v = m[0][c];
    if (op.isZero(v)) continue;
    const sm = clone(m);
    removeFrom(sm, c + 1, 1);
    let cofactor = determinant(sm, op);

    if (c % 2 === 1) {
      cofactor = op.negate(cofactor);
    }
    d = op.add(d, op.multiply(v, cofactor));
  }
  return d;
};
