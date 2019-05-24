/* eslint-disable object-property-newline */
import Array2d from './array-2d';
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

    this._values = new Array2d(values, dim, 1, 0);
  }

  clone() {
    return new Vector(this.value);
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
      this._values.assign((v, i) => (swizzled[i] === undefined ? v : swizzled[i]));
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
    if (values.length === 1 && Number.isFinite(values[0])) {
      this._values.assign(() => values[0]);
    } else {
      this._values.copyFrom(values);
    }
    return this;
  }

  // get component by index
  get(idx) {
    return this._values.getValueAt(idx);
  }

  // set value for component at index
  set(idx, v) {
    this._values.setValueAt(idx, 1, v);
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
      this._values.assign((v, i) => v + (vc[i] === undefined ? 0 : vc[i]));
    });
    return this;
  }

  sub(...args) {
    args.forEach((val) => {
      const vc = argumentsToList(val);
      this._values.assign((v, i) => v - (vc[i] === undefined ? 0 : vc[i]));
    });
    return this;
  }

  scale(...arg) {
    if (arg.length === 0) return this;
    if (arg.length === 1) {
      [arg] = arg;
    }
    if (Number.isFinite(arg)) {
      this._values.assign(v => v * arg);
    } else if (Array.isArray(arg) || arg instanceof Vector) {
      const vc = argumentsToList(arg);
      this._values.assign((v, i) => v * (vc[i] === undefined ? 0 : vc[i]));
    }
    return this;
  }

  clamp(min = 0, max = 1) {
    this._values.assign(v => op.clamp(v, min, max));
    return this;
  }

  normalize() {
    const l = this.length;
    this._values.assign(v => v / l);
    return this;
  }

  dot(arg) {
    if (!(arg instanceof Vector)) {
      const mat = arg._values || new Array2d(arg);
      let vec = this._values;
      if (this.dim < 4 && vec.cols < mat.rows) {
        // convert to homogeneous coordinates  (ex. vec3 * mat4)
        vec = this._values.clone().columns(mat.rows);
        vec[mat.rows - 1] = 1;
      }
      const res = op.dotProduct(vec, mat);
      return this.clone().copyFrom(res);
    }
    const v = arg;
    const vc = argumentsToList(v);
    return this.value.reduce((sum, c, i) => sum + c * vc[i], 0);
  }

  cross(v) {
    const a = this.value;
    const b = argumentsToList(v);

    if (this.dim === 2) {
      return (a[0] * b[1]) - (a[1] * b[0]);
    }

    const res = new Array2d(this.dim, this.dim);
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
    return this._values.toArray();
  }

  get dim() {
    return this._values.cols;
  }

  set dim(v) {
    if (v >= 2 && v <= 4 && v !== this.dim) {
      this._values.columns(v).init(1, 0, true);
    }
  }

  get length() {
    const squared = this._values.reduce((acc, c) => acc + c ** 2, 0);
    return Math.sqrt(squared);
  }

  get value() {
    return this._values;
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
