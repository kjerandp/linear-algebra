import { ncols, clone, removeFrom } from '../array';

function determinantRec(m, op) {
  if (m.length === 1) return m[0][0];

  let d = op.zero();
  const cols = ncols(m);
  for (let c = 0; c < cols; c++) {
    const v = m[0][c];
    if (op.isZero(v)) continue;
    const sm = clone(m);
    removeFrom(sm, 1, c + 1);
    let cofactor = determinantRec(sm, op);

    if (c % 2 === 1) {
      cofactor = op.negate(cofactor);
    }
    d = op.add(d, op.multiply(v, cofactor));
  }
  return d;
}

export default op => m => determinantRec(m._values, op);
