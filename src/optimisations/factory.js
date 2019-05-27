import dotProduct from './dot-product';
import determinant from './determinant';
import inverse from './inverse';
import identityMatrix from './identity';
import { clamp, mix, step, smoothstep } from './interpolation';
import numberTypeInterface from '../math/number-interface';

export default (op = numberTypeInterface) => ({
  ...op,
  sum: (values = []) => {
    let s = 0;
    for (let i = 0; i < values.length; i++) {
      if (!op.isDefined(values[i])) return undefined;
      s += values[i];
    }
    return s;
  },
  product: (values = []) => {
    let p = 1;
    for (let i = 0; i < values.length; i++) {
      if (!op.isDefined(values[i])) return undefined;
      if (values[i] === 0) return 0; // early termination
      p *= values[i];
    }
    return p;
  },
  negate: (values = []) => {
    for (let i = 0; i < values.length; i++) {
      values[i] = -values[i];
    }
  },
  scale: (factor, values = []) => {
    for (let i = 0; i < values.length; i++) {
      values[i] *= factor;
    }
  },
  clamp,
  dotProduct,
  determinant,
  inverse,
  mix,
  step,
  smoothstep,
  identityMatrix,
});
