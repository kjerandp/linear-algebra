import { cols, clone2d, removeFrom } from '../array';

export default function determinant(m) {
  if (m.length === 1) return m[0][0];

  let d = 0;
  const ncols = cols(m);
  for (let c = 0; c < ncols; c++) {
    const v = m[0][c];
    if (v === 0) continue;
    const sm = clone2d(m);
    removeFrom(sm, c + 1, 1);
    let cofactor = determinant(sm);

    if (c % 2 === 1) {
      cofactor = -cofactor;
    }
    d += v * cofactor;
  }
  return d;
}
