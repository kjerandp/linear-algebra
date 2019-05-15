import Vector, {
  vec2,
  vec3,
  vec4,
} from './vector';

import Matrix, {
  mat2,
  mat3,
  mat4,
  col2,
  col3,
  col4,
  row2,
  row3,
  row4,
} from './matrix';

import * as functions from './functions';
import * as constants from './constants';

export default {
  Vector,
  Matrix,
  vec2,
  vec3,
  vec4,
  mat2,
  mat3,
  mat4,
  col2,
  col3,
  col4,
  row2,
  row3,
  row4,
  ...functions,
  ...constants,
};

