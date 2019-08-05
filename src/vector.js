/* eslint-disable object-property-newline */
import {
  add,
  sub,
  scale,
  norm,
  dot,
  cross,
  cross2,
  dist,
  scalar,
} from './functions';
import { flattenList } from './utils';

const accessors = ({
  x: 0, r: 0, i: 0, s: 0,
  y: 1, g: 1, j: 1, t: 1,
  z: 2, b: 2, k: 2, u: 2,
  w: 3, a: 3, l: 3, v: 3,
});

class Vector extends Array {
  static fromArray(arr) {
    return new Vector(...arr);
  }

  add(...vectors) {
    return add(this, ...vectors);
  }

  sub(...vectors) {
    return sub(this, ...vectors);
  }

  scale(factor) {
    return scale(this, factor, this);
  }

  normalize() {
    return norm(this, this);
  }

  dot(other) {
    return dot(this, other);
  }

  cross(other) {
    return this.length === 2 ? cross2(this, other) : cross(this, other);
  }

  distance(other) {
    return dist(this, other);
  }

  clone() {
    return new Vector(...this);
  }

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

  scalar() {
    return scalar(this);
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

export default Vector;

export function vec(arr) {
  return Vector.fromArray(arr);
}

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

export function vec2(...args) {
  return nvec(2, args);
}

export function vec3(...args) {
  return nvec(3, args);
}

export function vec4(...args) {
  return nvec(4, args);
}
