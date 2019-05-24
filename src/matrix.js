import Array2d from './array-2d';
import { Vector } from './vector';
import {
  determinant2d,
  determinant3d,
  determinant4d,
} from './optimalisations/matrix';
import op from './math';

export class Matrix {
  constructor(rows = 4, cols) {
    if (rows > 0) {
      cols = cols || rows;
      this._values = new Array2d(null, cols, rows, 0);
    } else {
      const values = rows;
      this._values = new Array2d(values, cols);
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
    const m = new Array2d(null, vect.length, l);
    m.assign((foo, c, r) => vect[c].get(r));

    return new Matrix(m);
  }

  clone() {
    return new Matrix(this._values, this.cols);
  }

  copyFrom(...values) {
    if (values.length === 1 && op.isDefined(values[0])) {
      this._values.assign(() => values[0]);
    } else {
      this._values.copyFrom(values);
    }
    return this;
  }

  set(i, j, v) {
    if (op.isDefined(v)) {
      this._values.setValueAt(j - 1, i - 1, v);
    }
    return this;
  }

  get(i, j) {
    return this._values.getValueAt(j - 1, i - 1);
  }

  row(i) {
    if (i > 0 && i <= this.rows) {
      return this._values.getRow(i);
    }
    throw Error('Invalid arguments!');
  }

  col(j) {
    if (j > 0 && j <= this.cols) {
      return this._values.getColumn(j);
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
      d.push(this._values.getValueAt(ci, ri));
    }
    return d;
  }

  digonalReverse(j = this.cols) {
    return this.diagonal(j, true);
  }

  clamp(min = 0, max = 1) {
    this._values.assign(v => op.clamp(v, min, max));
    return this;
  }

  transpose() {
    this._values.transpose();
    return this;
  }

  add(...args) {
    args.forEach((m) => {
      if (this.rows !== m.rows || this.cols !== m.cols)
        throw Error('Matrices must be of same size!');
      this._values.assign((v, i) => op.add(v, m._values[i]));
    });
    return this;
  }

  sub(...args) {
    args.forEach((m) => {
      if (this.rows !== m.rows || this.cols !== m.cols)
        throw Error('Matrices must be of same size!');
      this._values.assign((v, i) => op.subtract(v, m._values[i]));
    });
    return this;
  }

  dot(arg) {
    const bIsVec = arg instanceof Vector;

    const a = this._values;
    let b = arg._values;

    if (bIsVec) {
      b = arg._values.clone();
      b.transpose();
      // make homogeneous
      if (b.rows < this.cols) {
        b.init(this.cols, 0, true);
        b.setValueAt(0, this.cols - 1, 1);
      }
    }

    const v = op.dotProduct(a, b || arg);

    if (bIsVec) {
      return new Vector(v).dimensions(arg.dim);
    }

    return new Matrix(v);
  }

  apply(...args) {
    args.forEach((m) => {
      if (m instanceof Matrix) {
        const v = op.dotProduct(this.value, m.value);
        this.copyFrom(v);
      }
    });
    return this;
  }

  scale(factor) {
    if (Number.isFinite(factor)) {
      this._values.assign(v => op.multiply(v, factor));
    }
    return this;
  }

  negate() {
    this._values.assign(v => op.negate(v));
    return this;
  }

  submatrix(i = 1, j = 1, rows = 2, cols = 2) {
    if (rows < 1 || cols < 1) throw Error('Invalid arguments!');

    const sub = this._values.copy(j, i, cols, rows);
    return new Matrix(sub, sub.cols);
  }

  remove(i = 0, j = 0) {
    if (!i && !j) return this;

    if (i > this.rows || j > this.cols)
      throw Error('Invalid arguments!');

    this._values.remove(j, i);
    return this;
  }

  // TODO: optimized versions
  det() {
    if (!this.isSquare) throw Error('Matrix must be square!');

    if (this.rows === 1) {
      return this._values[0];
    } else if (this.rows === 2 && this._optimise) {
      return determinant2d(this.toArray(2));
    } else if (this.rows === 3 && this._optimise) {
      return determinant3d(this.toArray(2));
    } else if (this.rows === 4 && this._optimise) {
      return determinant4d(this.toArray(2));
    }
    return op.determinant(this._values);
  }

  invert() {
    let inverse;
    if (!this.isSquare) {
      inverse = null;
    } else {
      inverse = op.inverse(this.value);
    }

    if (inverse) {
      this._values.copyFrom(inverse);
    } else {
      throw Error('Matrix cannot be inverted!');
    }
    return this;
  }

  toArray(dim = 2, inRowMajor = true) {
    return this._values.toArray(dim, inRowMajor);
  }

  get isSquare() {
    return this._values.isSquare;
  }

  get rows() {
    return this._values.rows;
  }

  get cols() {
    return this._values.cols;
  }

  get value() {
    return this._values;
  }

  get size() {
    return [this.rows, this.cols];
  }
}

// add extra accessors
for (let i = 1; i <= 4; i++) {
  for (let j = 1; j <= 4; j++) {
    Object.defineProperty(Matrix.prototype, `a${i}${j}`, {
      get() {
        return this.get(i, j);
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

