/* eslint-disable object-property-newline */
import { clampValue, dotArrays } from './internal';

const accessors = ({
  x: 0, r: 0, i: 0, s: 0,
  y: 1, g: 1, j: 1, t: 1,
  z: 2, b: 2, k: 2, u: 2,
  w: 3, a: 3, l: 3, v: 3,
});

class Vector {
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
      values = Vector.argsToComponents(args);
      dim = values.length;
    }

    if (dim < 2 || dim > 4) throw Error('Invalid arguments!');

    this._values = new Array(dim);
    if (values) {
      this.fill(values);
    } else {
      this._values.fill(0);
    }
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

  // immutable addition (returns new vector)
  add(v) {
    const n = this.clone();
    return n.addFrom(v);
  }

  // immutable subtraction (returns new vector)
  sub(v) {
    const n = this.clone();
    return n.subFrom(v);
  }

  // mutable addition (adds to and return self)
  addFrom(val) {
    const vc = Vector.argsToComponents(val);
    this.assign((v, i) => v + (vc[i] === undefined ? 0 : vc[i]));
    return this;
  }

  // mutable subtraction (subtract and returns self)
  subFrom(val) {
    const vc = Vector.argsToComponents(val);
    this.assign((v, i) => v - (vc[i] === undefined ? 0 : vc[i]));
    return this;
  }

  // mutable scale
  scale(val) {
    if (Number.isFinite(val)) {
      this.assign(v => v * val);
    } else if (Array.isArray(val) || val instanceof Vector) {
      const vc = Vector.argsToComponents(val);
      this.assign((v, i) => v * vc[i]);
    }
    return this;
  }

  // calculate the dot product
  dot(arg) {
    if (!(arg instanceof Vector)) {
      const mat = arg.value || arg;
      const res = dotArrays([this.value], mat);
      return this.clone().fill(res[0]);
    }
    const v = arg;
    const vc = Vector.argsToComponents(v);
    return this.value.reduce((sum, c, i) => sum + c * vc[i], 0);
  }

  // Calculate cross product vector for 3d vectors. In case of higher
  // dimension vectors, it will only consider the first three components.
  // In the 2d case, it will return a scalar (i.e. the area/determinant)
  cross(v) {
    if (this.dim < 2) {
      return 0;
    }
    const a = this.value;
    const b = Vector.argsToComponents(v);

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

    const l = Math.sqrt(c.filter((v, i) => i !== axis).reduce((sqr, v) => (sqr + v ** 2), 0));
    return Math.atan2(l, c[axis]);
  }

  clamp(min = 0, max = 1) {
    this.value.forEach((v, i) => this.set(i, clampValue(v, min, max)));
    return this;
  }

  normalize() {
    const l = this.length;
    this.assign(v => v / l);
    return this;
  }

  // Immutable version of normalize
  unitVector() {
    return this.clone().normalize();
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
      this.assign((v, i) => (swizzled[i] === undefined ? v : swizzled[i]));
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

    this.assign((v, i) => {
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

  assign(assignFunc) {
    for (let i = 0; i < this.dim; i++) {
      this._values[i] = assignFunc(this._values[i], i);
    }
    return this;
  }

  get length() {
    const squared = this.value.reduce((acc, c) => acc + c ** 2, 0);
    return Math.sqrt(squared);
  }

  get dim() {
    return this._values.length;
  }

  set dim(v) {
    if (v >= 2 && v <= 4 && v !== this._values.length) {
      const old = this._values;
      this._values = new Array(v).fill(0);
      this.fill(old);
    }
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

export default Vector;

export const vec2 = (...args) => new Vector(2).fill(Vector.argsToComponents(args));
export const vec3 = (...args) => new Vector(3).fill(Vector.argsToComponents(args));
export const vec4 = (...args) => new Vector(4).fill(Vector.argsToComponents(args));
