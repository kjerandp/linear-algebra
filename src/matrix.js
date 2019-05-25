import { Vector } from './vector';
import {
  determinant2d,
  determinant3d,
  determinant4d,
} from './optimalisations/matrix';
import {
  createArray2d,
  assignTo2d,
  copyTo2d,
  transpose,
  subArrayFrom,
  removeFrom,
  flatten,
  clone2d,
} from './array';
import { argumentsToList } from './utils';
import op from './math';

export class Matrix {
  constructor(rows = 4, cols) {
    if (rows > 0) {
      cols = cols || rows;
      this._values = createArray2d(null, cols, rows, 0);
    } else {
      const values = rows;
      if (Array.isArray(values[0]) && !cols) {
        cols = values[0].length;
        rows = values.length;
        this._values = clone2d(values);
      } else {
        this._values = createArray2d(argumentsToList(values, false), cols, rows, 0);
      }
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
    assignTo2d(m, (foo, c, r) => vect[c].get(r));
    return new Matrix(m);
  }

  clone() {
    return new Matrix(this._values);
  }

  copyFrom(...values) {
    if (values.length === 1 && Array.isArray(values[0])) {
      [values] = values;
    }
    if (values.length === 1 && op.isDefined(values[0])) {
      assignTo2d(this._values, () => values[0]);
    } else {
      copyTo2d(this._values, argumentsToList(values));
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
    assignTo2d(this._values, v => op.clamp(v, min, max));
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
      assignTo2d(this._values, (v, c, r) => op.add(v, m._values[r][c]));
    });
    return this;
  }

  sub(...args) {
    args.forEach((m) => {
      if (this.rows !== m.rows || this.cols !== m.cols)
        throw Error('Matrices must be of same size!');
      assignTo2d(this._values, (v, c, r) => op.subtract(v, m._values[r][c]));
    });
    return this;
  }

  dot(arg) {
    const bIsVec = arg instanceof Vector;

    const a = this._values;
    let b = arg._values;

    if (bIsVec) {
      b = arg._values.slice();
      // make homogeneous
      if (b.length < this.cols) {
        for (let i = b.length; i < a.length; i++) {
          const v = i === a.length - 1 ? 1 : 0;
          b.push(v);
        }
      }
      b = b.map(v => [v]);
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
        const v = op.dotProduct(this._values, m._values);
        this.copyFrom(v);
      }
    });
    return this;
  }

  scale(factor) {
    if (Number.isFinite(factor)) {
      assignTo2d(this._values, v => op.multiply(v, factor));
    }
    return this;
  }

  negate() {
    assignTo2d(this._values, v => op.negate(v));
    return this;
  }

  submatrix(i = 1, j = 1, rows = 2, cols = 2) {
    return new Matrix(subArrayFrom(this._values, i, j, rows, cols));
  }


  remove(i = 0, j = 0) {
    removeFrom(this._values, i, j);
    return this;
  }

  // TODO: optimised versions
  det() {
    if (!this.isSquare) throw Error('Matrix must be square!');

    if (this.rows === 1) {
      return this._values[0];
    } else if (this.rows === 2 && this._optimise) {
      return determinant2d(this._values);
    } else if (this.rows === 3 && this._optimise) {
      return determinant3d(this._values);
    } else if (this.rows === 4 && this._optimise) {
      return determinant4d(this._values);
    }
    return op.determinant(this._values);
  }

  invert() {
    let inverse;
    if (!this.isSquare) {
      inverse = null;
    } else {
      inverse = op.inverse(this.toArray(2));
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
      return inRowMajor ? this._values.slice() : transpose(this._values);
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

