/* eslint-disable object-property-newline */
import { createArray1d, copyTo1d, assignTo1d } from './array';
import { argumentsToList } from './utils';
import op from './math';


const accessors = ({
  x: 0, r: 0, i: 0, s: 0,
  y: 1, g: 1, j: 1, t: 1,
  z: 2, b: 2, k: 2, u: 2,
  w: 3, a: 3, l: 3, v: 3,
});

export class Vector {
  constructor(...args) {
    if (args.length === 0)
      throw Error('No arguments provided!');

    if (args.length === 1 && Array.isArray(args[0])) {
      [args] = args;
    }

    let dim = 0;
    let values = null;

    if (args.length === 1 && Number.isFinite(args[0])) {
      [dim] = args;
    } else {
      values = argumentsToList(args);
      dim = values.length;
    }
    if (dim < 2 || dim > 4) throw Error('Invalid arguments!');

    this._values = createArray1d(values, dim, 0);
  }

  clone() {
    return new Vector(this._values);
  }

  // Mimic the swizzle operator for vectors in glsl
  swizzle(args) {
    const components = new Array(args.length);
    for (let i = 0; i < args.length; i++) {
      const ai = accessors[args[i]];
      if (!(ai >= 0)) throw new Error('Invalid arguments!');
      components[i] = this._values[ai];
    }
    return components;
  }

  // Use swizzle to rearrange components
  shift(args) {
    if (args.length > 0 && args.length <= this.dim) {
      const swizzled = this.swizzle(args);
      assignTo1d(this._values, (v, i) => (swizzled[i] === undefined ? v : swizzled[i]));
    }
    return this;
  }

  // Same as clone but with the option to swizzle
  copy(args) {
    const v = this.clone();
    if (args) {
      v.shift(args);
    }
    return v;
  }

  copyFrom(...values) {
    if (values.length === 1 && Array.isArray(values[0])) {
      [values] = values;
    }
    if (values.length === 1 && Number.isFinite(values[0])) {
      assignTo1d(this._values, () => values[0]);
    } else {
      copyTo1d(this._values, argumentsToList(values));
    }
    return this;
  }

  // get component by index
  get(idx) {
    return this._values[idx];
  }

  // set value for component at index
  set(idx, v) {
    if (idx < this.dim) this._values[idx] = v;
    return this;
  }

  angle(axis = 0) {
    const [x, y, z] = this._values;
    if (this.dim === 2) {
      return Math.atan2(y, x);
    }
    if (axis > 2 || axis < 0) return undefined;

    let a, b, c;
    switch (axis) {
      case 0: a = y; b = z; c = x; break;
      case 1: a = x; b = z; c = y; break;
      default: a = x; b = y; c = z;
    }
    const l = Math.sqrt(a ** 2 + b ** 2);
    return Math.atan2(l, c);
  }

  add(...args) {
    args.forEach((val) => {
      const vc = argumentsToList(val);
      assignTo1d(this._values, (v, i) => v + (vc[i] === undefined ? 0 : vc[i]));
    });
    return this;
  }

  sub(...args) {
    args.forEach((val) => {
      const vc = argumentsToList(val);
      assignTo1d(this._values, (v, i) => v - (vc[i] === undefined ? 0 : vc[i]));
    });
    return this;
  }

  scale(...arg) {
    if (arg.length === 0) return this;
    if (arg.length === 1) {
      [arg] = arg;
    }
    if (Number.isFinite(arg)) {
      assignTo1d(this._values, v => v * arg);
    } else if (Array.isArray(arg) || arg instanceof Vector) {
      const vc = argumentsToList(arg);
      assignTo1d(this._values, (v, i) => v * (vc[i] === undefined ? 0 : vc[i]));
    }
    return this;
  }

  clamp(min = 0, max = 1) {
    assignTo1d(this._values, v => op.clamp(v, min, max));
    return this;
  }

  normalize() {
    const l = this.length;
    assignTo1d(this._values, v => v / l);
    return this;
  }

  dot(arg) {
    if (!(arg instanceof Vector)) {
      const mat = arg._values || arg;
      let vec = this._values;
      if (this.dim < 4 && this.dim < mat.length) {
        // convert to homogeneous coordinates  (ex. vec3 * mat4)
        vec = createArray1d(vec, mat.length, 0);
        vec[mat.length - 1] = 1;
      }
      const res = op.dotProduct([vec], mat);

      return this.clone().copyFrom(res[0]);
    }
    const v = arg;
    const vc = argumentsToList(v);
    return this._values.reduce((sum, c, i) => sum + c * vc[i], 0);
  }

  cross(v) {
    const a = this._values;
    const b = argumentsToList(v);

    if (this.dim === 2) {
      return (a[0] * b[1]) - (a[1] * b[0]);
    }

    const res = new Array(this.dim);
    res[0] = (a[1] * b[2]) - (a[2] * b[1]);
    res[1] = (a[2] * b[0]) - (a[0] * b[2]);
    res[2] = (a[0] * b[1]) - (a[1] * b[0]);

    return new Vector(res);
  }

  dimensions(v) {
    this.dim = v;
    return this;
  }

  toArray() {
    return this._values;
  }

  get dim() {
    return this._values.length;
  }

  set dim(v) {
    if (v >= 2 && v <= 4 && v !== this.dim) {
      this._values = createArray1d(this._values, v, 0);
    }
  }

  get length() {
    const squared = this._values.reduce((acc, c) => acc + c ** 2, 0);
    return Math.sqrt(squared);
  }
}

// add getters and setters from accessors
Object.keys(accessors).forEach((a) => {
  Object.defineProperty(Vector.prototype, a, {
    get() {
      return this._values[accessors[a]];
    },
    set(v) {
      if (Number.isFinite(v)) {
        this._values[accessors[a]] = v;
      }
    },
  });
});

export const vec2 = (...args) => new Vector(2).copyFrom(...args);
export const vec3 = (...args) => new Vector(3).copyFrom(...args);
export const vec4 = (...args) => new Vector(4).copyFrom(...args);
