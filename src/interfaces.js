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
