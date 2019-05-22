/* eslint-disable object-property-newline */
import Array2d from './array-2d';
import { argumentsToList } from './utils';
import { dotArrays } from './common';

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

    this._values = new Array2d(values, dim, 1);
  }

  // Helper function to convert input arguments to a single
  // array of finite numbers
  static argsToComponents(args) {
    if (!args || args.length === 0) {
      return [];
    }
    const values = [];
    if (Array.isArray(args)) {
      args.forEach((v) => {
        if (v instanceof Vector) {
          values.push(...v.value);
        } else if (Number.isFinite(v)) {
          values.push(v);
        } else if (Array.isArray(v)) {
          values.push(...v.filter(n => Number.isFinite(n)));
        }
      });
    } else if (args instanceof Vector) {
      values.push(...args.value);
    }

    return values;
  }

  // get component by index
  get(idx) {
    return this._values[idx];
  }

  // set value for component at index
  set(idx, v) {
    if (Number.isFinite(v) && idx >= 0 && idx < this.dim) {
      this._values[idx] = v;
    }
    return this;
  }

  clone() {
    const v = new Vector(this.value);
    v.dim = this.dim;
    return v;
  }

  // mutable addition (adds to and return self)
  add(...args) {
    args.forEach((val) => {
      const vc = argumentsToList(val);
      this._values.assign((v, i) => v + (vc[i] === undefined ? 0 : vc[i]));
    });
    return this;
  }

  // mutable subtraction (subtract and returns self)
  sub(...args) {
    args.forEach((val) => {
      const vc = argumentsToList(val);
      this._values.assign((v, i) => v - (vc[i] === undefined ? 0 : vc[i]));
    });
    return this;
  }

  // mutable scale
  scale(...val) {
    if (val.length === 0) return this;
    if (val.length === 1) {
      [val] = val;
    }
    if (Number.isFinite(val)) {
      this._values.scale(val);
    } else if (Array.isArray(val) || val instanceof Vector) {
      const vc = argumentsToList(val);
      this._values.assign((v, i) => v * (vc[i] === undefined ? 0 : vc[i]));
    }
    return this;
  }

  // calculate the dot product
  dot(arg) {
    if (!(arg instanceof Vector)) {
      const mat = arg.value || arg;
      const vec = this.value;
      if (this.dim < 4 && vec.length < mat.length) {
        // convert to homogeneous coordinates  (ex. vec3 * mat4)
        for (let i = vec.length; i < mat.length; i++) {
          const v = i === mat.length - 1 ? 1 : 0;
          vec.push(v);
        }
      }
      const res = dotArrays([vec], mat);
      return this.clone().fill(res[0]);
    }
    const v = arg;
    const vc = argumentsToList(v);
    return this.value.reduce((sum, c, i) => sum + c * vc[i], 0);
  }

  // Calculate cross product vector for 3d vectors. In case of higher
  // dimension vectors, it will only consider the first three components.
  // In the 2d case, it will return a scalar (i.e. the area/determinant)
  cross(v) {
    const a = this.value;
    const b = argumentsToList(v);

    if (this.dim === 2) {
      return (a[0] * b[1]) - (a[1] * b[0]);
    }

    const res = new Array(this.dim).fill(0);
    res[0] = (a[1] * b[2]) - (a[2] * b[1]);
    res[1] = (a[2] * b[0]) - (a[0] * b[2]);
    res[2] = (a[0] * b[1]) - (a[1] * b[0]);

    return new Vector(res).dimensions(this.dim);
  }

  angle(axis = 0) {
    const c = this._values.slice(0, 3);
    if (this.dim === 2) {
      return Math.atan2(c[1], c[0]);
    }
    if (axis > 2 || axis < 0) return undefined;
    const l = Math.sqrt(c.filter((v, i) => i !== axis).reduce((sqr, v) => (sqr + v ** 2), 0));
    return Math.atan2(l, c[axis]);
  }

  clamp(min = 0, max = 1) {
    this._values.clamp(min, max);
    return this;
  }

  negate() {
    this._values.negate();
    return this;
  }

  normalize() {
    const l = this.length;
    this._values.assign(v => v / l);
    return this;
  }

  // Mimic the swizzle operator for vectors in glsl
  swizzle(args) {
    const components = new Array(args.length);
    const values = this.value;
    for (let i = 0; i < args.length; i++) {
      const ai = accessors[args[i]];
      if (!(ai >= 0)) throw new Error('Invalid arguments!');
      components[i] = values[ai];
    }
    return components;
  }

  // Use swizzle to rearrange components
  swap(args) {
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
      v.swap(args);
    }
    return v;
  }

  // fill components (left to right). If a single numeric value
  // is provided, it will assign all components to that value.
  fill(...values) {
    if (values.length === 1 && Array.isArray(values[0])) {
      [values] = values;
    }

    this._values.assign((v, i) => {
      if (i < values.length) {
        return values[i];
      } else if (values.length === 1) {
        return values[0];
      }
      return 0;
    });

    return this;
  }

  // Set the number of dimensions for this vector
  dimensions(n) {
    this.dim = n;
    return this;
  }

  get length() {
    const squared = this._values.reduce((acc, c) => acc + c ** 2, 0);
    return Math.sqrt(squared);
  }

  get dim() {
    return this._values.cols;
  }

  set dim(v) {
    if (v >= 2 && v <= 4 && v !== this._values.cols) {
      this._values.columns(v).init(1, 0, true);
    }
  }

  get value() {
    return this._values.toArray();
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

export const vec2 = (...args) => new Vector(2).fill(Vector.argsToComponents(args));
export const vec3 = (...args) => new Vector(3).fill(Vector.argsToComponents(args));
export const vec4 = (...args) => new Vector(4).fill(Vector.argsToComponents(args));
