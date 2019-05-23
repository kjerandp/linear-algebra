import { EPSILON } from './constants';

export const numberTypeInterface = {
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

export default (op = numberTypeInterface) => ({
  ...op,
  sum: (...values) => {
    let s = op.zero();
    for (let i = 0; i < values.length; i++) {
      if (!op.isDefined(values[i])) return undefined;
      s = op.add(s, values[i]);
    }
    return s;
  },
  product: (...values) => {
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
  negate: (...values) => {
    for (let i = 0; i < values.length; i++) {
      values[i] = op.negate(values[i]);
    }
  },
  scale: (factor, ...values) => {
    for (let i = 0; i < values.length; i++) {
      values[i] = op.multiply(values[i], factor);
    }
  },
});

