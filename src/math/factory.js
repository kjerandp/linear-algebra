import numberTypeInterface from './number-interface';
import dotProduct from './dot-product';
import determinant from './determinant';
import inverse from './inverse';
import identityMatrix from './identity';
import { clamp, mix, step, smoothstep } from './interpolation';

export default (op = numberTypeInterface) => ({
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
    let p = op.identity();
    for (let i = 0; i < values.length; i++) {
      if (!op.isDefined(values[i])) return undefined;
      if (op.isZero(values[i])) return op.zero(); // early termination
      p = op.multiply(p, values[i]);
    }
    return p;
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
  clamp: (v, min, max) => clamp(v, min, max, op),
  dotProduct: (a, b) => dotProduct(a, b, op),
  determinant: m => determinant(m, op),
  inverse: m => inverse(m, op),
  mix: (a, b, t) => mix(a, b, t, op),
  step: (edge, x) => step(edge, x, op),
  smoothstep: (edge0, edge1, x) => smoothstep(edge0, edge1, x, op),
  identityMatrix: size => identityMatrix(size, op),
});
