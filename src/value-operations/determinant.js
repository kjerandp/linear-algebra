export default function determinant(m, op) {
  if (!m.isSquare) {
    throw new TypeError('Matrix must be a square!');
  }
  if (m.rows === 1) return m[0];

  let d = op.zero();

  for (let c = 0; c < m.cols; c++) {
    const v = m[c];
    if (op.isZero(v)) continue;
    let cofactor = determinant(m.clone().remove(c + 1, 1), op);

    if (c % 2 === 1) {
      cofactor = op.negate(cofactor);
    }
    d = op.add(d, op.multiply(v, cofactor));
  }
  return d;
}
