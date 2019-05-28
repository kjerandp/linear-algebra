import { Vector } from './vector';
import {
  createArray2d,
  assignTo,
  transpose,
  subArrayFrom,
  removeFrom,
  flatten,
  clone,
} from './array';
import { argumentsToList } from './utils';
import op from './math';

export class Matrix {
  constructor(rows = 4, cols) {
    if (Array.isArray(rows) && Array.isArray(rows[0]) && !cols) {
      this._values = rows.map(row => row.slice());
    } else if (rows > 0) {
      cols = cols || rows;
      this._values = createArray2d(null, cols, rows);
    } else {
      const values = rows;
      this._values = createArray2d(argumentsToList(values, false), cols, rows, 0);
    }
    this._optimise = true;
  }

  static identity(size = 4) {
    return new Matrix(op.identityMatrix(size));
  }

  static fromVectors(...vect) {
    if (vect.length === 0) throw Error('Invalid arguments!');
    const [first] = vect;
    const l = (first instanceof Vector) && first.dim;

    if (!l || vect.some(v => v.dim !== l)) {
      throw Error('Vectors must be of the same dimension!');
    }
    const m = createArray2d(null, vect.length, l);
    assignTo(m, (foo, c, r) => vect[c].get(r));
    return new Matrix(m);
  }

  clone() {
    return new Matrix(this._values);
  }

  copyFrom(...values) {
    if (values.length === 1 && Array.isArray(values[0])) {
      [values] = values;
    }
    if (values.length === 1) {
      assignTo(this._values, () => values[0]);
    } else {
      let i = 0;
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (i >= values.length) return this;
          this._values[r][c] = values[i++];
        }
      }
    }
    return this;
  }

  set(i, j, v) {
    if (op.isDefined(v)) {
      this._values[i - 1][j - 1] = v;
    }
    return this;
  }

  get(i, j) {
    return this._values[i - 1][j - 1];
  }


  row(i) {
    if (i > 0 && i <= this.rows) {
      return this._values[i - 1];
    }
    throw Error('Invalid arguments!');
  }

  col(j) {
    if (j > 0 && j <= this.cols) {
      return this._values.map(row => row[j - 1]);
    }
    throw Error('Invalid arguments!');
  }


  diagonal(j = 1, reverse = false) {
    if (j <= 0 || j > this.cols) throw Error('Invalid arguments!');
    const d = [];
    const c = j - 1;
    for (let r = 0; r < this.rows; r++) {
      const ri = r;
      const ci = (reverse ? c - r + this.cols : r + c) % this.cols;
      d.push(this._values[ri][ci]);
    }
    return d;
  }

  digonalReverse(j = this.cols) {
    return this.diagonal(j, true);
  }

  clamp(min = 0, max = 1) {
    assignTo(this._values, v => op.clamp(v, min, max));
    return this;
  }

  transpose() {
    this._values = transpose(this._values);

    return this;
  }

  add(...args) {
    args.forEach((m) => {
      if (this.rows !== m.rows || this.cols !== m.cols)
        throw Error('Matrices must be of same size!');
      assignTo(this._values, (v, c, r) => op.add(v, m._values[r][c]));
    });
    return this;
  }

  sub(...args) {
    args.forEach((m) => {
      if (this.rows !== m.rows || this.cols !== m.cols)
        throw Error('Matrices must be of same size!');
      assignTo(this._values, (v, c, r) => op.subtract(v, m._values[r][c]));
    });
    return this;
  }

  dot(arg) {
    const bIsVec = arg instanceof Vector;

    const a = this._values;
    let b = arg._values;

    if (bIsVec) {
      // make homogeneous
      if (arg._values.length < this.cols) {
        b = arg._values.slice();
        for (let i = b.length; i < a.length; i++) {
          const v = i === a.length - 1 ? 1 : 0;
          b.push(v);
        }
      }
      b = b.map(v => [v]);
    }

    const v = op.dotProduct(a, b || arg);

    if (bIsVec) {
      const comp = v.map(val => val[0]);
      if (arg._values.length < comp.length) {
        comp.splice(arg._values.length);
      }
      return new Vector(comp);
    }

    return new Matrix(v);
  }

  apply(...args) {
    args.forEach((m) => {
      if (m instanceof Matrix) {
        const v = op.dotProduct(this._values, m._values);
        this.copyFrom(v);
      }
    });
    return this;
  }

  scale(factor) {
    if (Number.isFinite(factor)) {
      assignTo(this._values, v => op.multiply(v, factor));
    }
    return this;
  }

  negate() {
    assignTo(this._values, v => op.negate(v));
    return this;
  }

  submatrix(i = 1, j = 1, rows = 2, cols = 2) {
    return new Matrix(subArrayFrom(this._values, i, j, rows, cols));
  }


  remove(i = 0, j = 0) {
    removeFrom(this._values, i, j);
    return this;
  }

  det() {
    if (!this.isSquare) throw Error('Matrix must be square!');
    return op.determinant(this);
  }

  invert() {
    let inverse;
    if (!this.isSquare) {
      inverse = null;
    } else {
      inverse = op.inverse(clone(this._values));
    }
    if (inverse) {
      this._values = inverse;
    } else {
      throw Error('Matrix cannot be inverted!');
    }
    return this;
  }

  toArray(dim = 1, inRowMajor = true) {
    if (dim === 2) {
      return inRowMajor ? clone(this._values) : transpose(this._values);
    }
    const arr = this._values;
    if (!inRowMajor) transpose(arr);
    return flatten(arr);
  }

  get isSquare() {
    return this.rows === this.cols;
  }

  get rows() {
    return this._values.length;
  }

  get cols() {
    return this._values[0].length;
  }

  get size() {
    return [this.rows, this.cols];
  }

  get count() {
    return this.rows * this.cols;
  }

  iterator() {
    const _t = this;
    let r = 0;
    let c = 0;
    return {
      next: () => {
        if (c >= this.cols) {
          r++;
          c = 0;
        }
        let v;
        if (r < this.rows) {
          v = _t[r][c++];
        }
        return {
          value: v,
          done: v === undefined,
        };
      },
    };
  }
}

// add extra accessors
for (let i = 1; i <= 4; i++) {
  for (let j = 1; j <= 4; j++) {
    Object.defineProperty(Matrix.prototype, `a${i}${j}`, {
      get() {
        return this._values[i - 1][j - 1];
      },
      set(v) {
        this.set(i, j, v);
      },
    });
  }
}

export const mat2 = (...values) => new Matrix(2, 2).copyFrom(...values);
export const mat3 = (...values) => new Matrix(3, 3).copyFrom(...values);
export const mat4 = (...values) => new Matrix(4, 4).copyFrom(...values);

export const col2 = (...values) => new Matrix(2, 1).copyFrom(...values);
export const col3 = (...values) => new Matrix(3, 1).copyFrom(...values);
export const col4 = (...values) => new Matrix(4, 1).copyFrom(...values);

export const row2 = (...values) => new Matrix(1, 2).copyFrom(...values);
export const row3 = (...values) => new Matrix(1, 3).copyFrom(...values);
export const row4 = (...values) => new Matrix(1, 4).copyFrom(...values);

