import { cols, clone2d, removeFrom } from '../array';

export default function determinant(m, op) {
  if (m.length === 1) return m[0][0];

  let d = op.zero();
  const ncols = cols(m);
  for (let c = 0; c < ncols; c++) {
    const v = m[0][c];
    if (op.isZero(v)) continue;
    const sm = clone2d(m);
    removeFrom(sm, c + 1, 1);
    let cofactor = determinant(sm, op);

    if (c % 2 === 1) {
      cofactor = op.negate(cofactor);
    }
    d = op.add(d, op.multiply(v, cofactor));
  }
  return d;
}
