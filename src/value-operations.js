import { numberTypeInterface } from './interfaces';

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

