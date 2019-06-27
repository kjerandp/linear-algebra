import numberTypeInterface from './number-interface';
import dotProduct from './dot-product';
import determinant from './determinant';
import inverse from './inverse';
import identityMatrix from './identity';
import { clamp, mix, step, smoothstep } from './interpolation';
import roundTo from './round-to';

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
  clamp: clamp(op),
  roundTo: roundTo(op),
  dotProduct: dotProduct(op),
  determinant: determinant(op),
  inverse: inverse(op),
  mix: mix(op),
  step: step(op),
  smoothstep: smoothstep(op),
  identityMatrix: identityMatrix(op),
});
