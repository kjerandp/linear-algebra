// import { EPSILON } from '../constants';

const EPSILON = 0.0000001;

export default {
  default: () => 0,
  zero: () => 0,
  identity: (n = 1) => n,
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  pow: (v, exp) => v ** exp,
  divide: (a, b) => a / b,
  negate: v => -v,
  isEqual: (a, b) => a === b,
  isZero: v => Math.abs(v) < EPSILON,
  isLessThan: (a, b) => a < b,
  isDefined: v => Number.isFinite(v),
  round: v => Math.round(v),
  ceil: v => Math.ceil(v),
  floor: v => ~~v,
};
