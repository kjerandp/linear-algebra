import { EPSILON } from './constants';

const numberTypeInterface = {
  default: () => 0,
  zero: () => 0,
  unitValue: () => 1,
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  negate: v => -v,
  isZero: v => Math.abs(v) < EPSILON,
  isLessThan: (a, b) => a < b,
  isDefined: v => v !== undefined && v !== null && Number.isFinite(v),
};

function determinant(m, op) {
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

export const factory = (op = numberTypeInterface) => ({
  ...op,
  sum: (values = []) => {
    let s = op.zero();
    for (let i = 0; i < values.length; i++) {
      if (!op.isDefined(values[i])) return undefined;
      s = op.add(s, values[i]);
    }
    return s;
  },
  product: (values = []) => {
    let p = op.unitValue();
    for (let i = 0; i < values.length; i++) {
      if (!op.isDefined(values[i])) return undefined;
      if (op.isZero(values[i])) return op.zero(); // early termination
      p = op.multiply(p, values[i]);
    }
    return p;
  },
  clamp: (v, min = 0, max = 1) => {
    if (op.isLessThan(v, min)) return min;
    if (op.isLessThan(max, v)) return max;
    return v;
  },
  negate: (values = []) => {
    for (let i = 0; i < values.length; i++) {
      values[i] = op.negate(values[i]);
    }
  },
  scale: (factor, values = []) => {
    for (let i = 0; i < values.length; i++) {
      values[i] = op.multiply(values[i], factor);
    }
  },
  determinant: m => determinant(m, op),
});

export default factory();
