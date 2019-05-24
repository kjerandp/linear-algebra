import { EPSILON } from '../constants';

export default {
  default: () => 0,
  zero: () => 0,
  identity: (n = 1) => n,
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  negate: v => -v,
  isEqual: (a, b) => a === b,
  isZero: v => Math.abs(v) < EPSILON,
  isLessThan: (a, b) => a < b,
  isDefined: v => v !== undefined && v !== null && Number.isFinite(v),
};
