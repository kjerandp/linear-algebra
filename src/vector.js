/* eslint-disable object-property-newline */
import {
  add,
  addAll,
  sub,
  subAll,
  scale,
  norm,
  dot,
  cross,
  cross2,
  dist,
  scalar,
} from './functions';
import { flattenList } from './utils';

/** mapping of additional accessors to array index */
const accessors = ({
  x: 0, r: 0, i: 0, s: 0,
  y: 1, g: 1, j: 1, t: 1,
  z: 2, b: 2, k: 2, u: 2,
  w: 3, a: 3, l: 3, v: 3,
});

/**
 * Simple extension to js Array to allow function chaining when doing vector operations.
 * A vector instance can be used the same way as a native Array instance. Note that length will
 * therefore return the number of vector components, and not its scalar value.
 * Use the scalar function if you want to know the vector's length.
 *
 * Instantiate a vector by its constructor or using one of the factory functions (vec2, vec3...)
 */

export class Vector extends Array {
  /**
   * Instantiate a vector from an array.
   * @param {Array} arr array of numbers
   * @return {Vector}
   */
  static fromArray(arr) {
    return new Vector(...arr);
  }

  /**
   * Add one or more vectors to this vector
   * @param  {...Array} vectors vectors to add to this
   * @return {Vector}
   */
  add(...vectors) {
    if (vectors.length === 1) {
      return add(this, vectors[0]);
    }
    return addAll(vectors, this);
  }

  /**
   * Subtract one or more vectors from this vector
   * @param  {...Array} vectors vectors to subtract from this vector
   * @return {Vector}
   */
  sub(...vectors) {
    if (vectors.length === 1) {
      return sub(this, vectors[0]);
    }
    return subAll(this, vectors);
  }

  /**
   * Calculate the scalar product (length) of this vector.
   */
  scalar() {
    return scalar(this);
  }

  /**
   * Scale this vector by a factor
   * @param {number} factor scaling factor
   * @param {Array/Vector} target optional array/vector to avoid mutating this vector
   * @return {Vector}
   */
  scale(factor, target = null) {
    return scale(this, factor, target || this);
  }

  /**
   * Negate all components of this vector
   * @param {Array/Vector} target optional array/vector to avoid mutating this vector
   * @return {Vector}
   */
  negate(target = null) {
    return this.scale(-1, target);
  }

  /**
   * Normalize this vector
   * @param {Array/Vector} target optional array/vector to avoid mutating this vector
   * @return {Vector}
   */
  normalize(target = null) {
    return norm(this, target || this);
  }

  /**
   * Calculate the dot product between this vector and the passed in argument
   * @param {Array} other vector
   * @return {number} dot product
   */
  dot(other) {
    return dot(this, other);
  }

  /**
   * Find the cross product vector between this vector and the passed in argument.
   * Only for 3d vectors!
   * @param {Array} other 3d vector
   * @param {Array/Vector} target optional array/vector to avoid mutating this vector
   * @return {Vector}
   */
  cross(other, target = null) {
    return cross(this, other, target);
  }

  /**
   * Calculate the psudo cross product between this vector and the passed in argument.
   * Only for 2d vectors!
   * @param {Array} other 2d vector
   * @return {number} psudo cross product
   */
  cross2(other) {
    return cross2(this, other);
  }

  /**
   * Calculate the distance between this coordinates to the coordinates supplied in the argument
   * @param {Array} other coordinates
   * @return {number} distance
   */
  distance(other) {
    return dist(this, other);
  }

  /**
   * Clone/copy vector
   * @return {Vector}
   */
  clone() {
    return new Vector(...this);
  }

  /**
   * Mimic the swizzle feature in glsl. Supply the swizzle pattern as a string, using the
   * defined accessors (xyzw, rgba, ijkl or stuv):
   * ex: vec.swizzle('xxyw') or vec.swizzle('rrra)
   * @param {string} pattern swizzle pattern
   * @param {Array/Vector} target optional array/vector to avoid mutating this vector
   * @return {Vector}
   */
  swizzle(pattern, target = null) {
    let values = this;
    if (!target) {
      target = this;
      values = [...this];
    }
    const l = target.length || pattern.length;
    for (let i = 0; i < l; i++) {
      const ai = accessors[pattern[i]];
      target[i] = values[ai];
    }
    return target;
  }

  /**
   * Assign values to this vector
   * @param  {...number} v values to set
   * @return {Vector}
   */
  set(...v) {
    for (let i = 0; i < v.length; i++) {
      /** assign value */
      this[i] = v[i];
    }
    return this;
  }
}

// add getters and setters from accessors
Object.keys(accessors).forEach((a) => {
  Object.defineProperty(Vector.prototype, a, {
    get() {
      return this[accessors[a]];
    },
    set(v) {
      if (Number.isFinite(v)) {
        this[accessors[a]] = v;
      }
    },
  });
});

/**
 * Create a vector of specific dimension and optionally set its values.
 * If values contains only one element, the all components will be set to
 * this value. Elements in values exceeding the specified dimension will
 * be neglected.
 * @param {number} dim the number of components
 * @param {Array<number>} values optional initial values
 * @return {Vector}
 */
export function nvec(dim = 0, values = [0]) {
  if (values.length === 1 && Number.isFinite(values[0])) {
    return new Vector(dim).fill(values[0]);
  }
  const v = new Vector();
  flattenList(values, v, dim);
  for (let i = v.length; i < dim; i++) {
    v.push(0);
  }
  return v;
}

/**
 * Factory function for creating and assigning a 2d vector. If a single
 * argument is passed, then all components will be assigned with its value.
 * Missing initial values will be filled with zeros.
 * @param  {...number} args initial values
 * @return {Vector}
 */
export function vec2(...args) {
  return nvec(2, args);
}

/**
 * Factory function for creating and assigning a 3d vector. If a single
 * argument is passed, then all components will be assigned with its value.
 * Missing initial values will be filled with zeros.
 * @param  {...number} args initial values
 * @return {Vector}
 */
export function vec3(...args) {
  return nvec(3, args);
}

/**
 * Factory function for creating and assigning a 4d vector. If a single
 * argument is passed, then all components will be assigned with its value.
 * Missing initial values will be filled with zeros.
 * @param  {...number} args initial values
 * @return {Vector}
 */
export function vec4(...args) {
  return nvec(4, args);
}
