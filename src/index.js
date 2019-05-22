import * as vector from './vector';
import * as matrix from './matrix';
import * as functions from './functions';
import * as constants from './constants';

export default {
  ...vector,
  ...matrix,
  ...functions,
  ...constants,
};

export { default as Array2d } from './array-2d';
