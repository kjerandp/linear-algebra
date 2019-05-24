import Array2d from './array-2d';
import { Vector } from './vector';
import { clampValue, dotArrays } from './common';
import {
  determinant2d,
  determinant3d,
  determinant4d,
} from './optimalisations/matrix';
import op from './value-operations';

// TODO
const _fillIdentity = (size) => {
  const values = new Array(size);
  for (let r = 0, c = 0; r < size; r++, c++) {
    values[r] = new Array(size).fill(0);
    values[r][c] = 1;
  }
  return values;
};

// TODO
function _findInverse(arr) {
  const dim = arr.length;
  const result = _fillIdentity(dim);

  for (let i = 0; i < dim; i++) {
    let e = arr[i][i];
    // if we have a 0 on the diagonal (we'll need to swap with a lower row)
    if (e === 0) {
      // look through every row below the i'th row
      for (let ii = i + 1; ii < dim; ii += 1) {
        // if the ii'th row has a non-0 in the i'th col
        if (arr[ii][i] !== 0) {
          // it would make the diagonal have a non-0 so swap it
          for (let j = 0; j < dim; j++) {
            e = arr[i][j]; // temp store i'th row
            arr[i][j] = arr[ii][j]; // replace i'th row by ii'th
            arr[ii][j] = e; // repace ii'th by temp
            e = result[i][j]; // temp store i'th row
            result[i][j] = result[ii][j]; // replace i'th row by ii'th
            result[ii][j] = e; // repace ii'th by temp
          }
          // don't bother checking other rows since we've swapped
          break;
        }
      }
      // get the new diagonal
      e = arr[i][i];
      // if it's still 0, not invertable (error)
      if (e === 0) return undefined;
    }

    // Scale this row down by e (so we have a 1 on the diagonal)
    for (let j = 0; j < dim; j++) {
      arr[i][j] /= e; // apply to original matrix
      result[i][j] /= e; // apply to identity
    }

    // Subtract this row (scaled appropriately for each row) from ALL of
    // the other rows so that there will be 0's in this column in the
    // rows above and below this one
    for (let ii = 0; ii < dim; ii++) {
      // Only apply to other rows (we want a 1 on the diagonal)
      if (ii === i) continue;

      // We want to change this element to 0
      e = arr[ii][i];

      // Subtract (the row above(or below) scaled by e) from (the
      // current row) but start at the i'th column and assume all the
      // stuff left of diagonal is 0 (which it should be if we made this
      // algorithm correctly)
      for (let j = 0; j < dim; j++) {
        arr[ii][j] -= e * arr[i][j]; // apply to original matrix
        result[ii][j] -= e * result[i][j]; // apply to identity
      }
    }
  }

  return result;
}

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
    return new Matrix(_fillIdentity(size));
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
    if (values.length === 1 && Number.isFinite(values[0])) {
      this._values.assign(() => values[0]);
    } else {
      this._values.copyFrom(values);
    }
    return this;
  }

  set(i, j, v) {
    if (i > 0 && i <= this.rows && j > 0 && j <= this.cols && Number.isFinite(v)) {
      this._values.setValueAt(j - 1, i - 1, v);
    }
    return this;
  }

  get(i, j) {
    if (i > 0 && i <= this.rows && j > 0 && j <= this.cols) {
      return this._values.getValueAt(j - 1, i - 1);
    }
    throw Error('Out of range!');
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
    this._values.assign(v => clampValue(v, min, max));
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
      this._values.assign((v, i) => v + m._values[i]);
    });
    return this;
  }

  sub(...args) {
    args.forEach((m) => {
      if (this.rows !== m.rows || this.cols !== m.cols)
        throw Error('Matrices must be of same size!');
      this._values.assign((v, i) => v - m._values[i]);
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

    const v = dotArrays(a, b || arg);

    if (bIsVec) {
      return new Vector(v).dimensions(arg.dim);
    }

    return new Matrix(v);
  }

  apply(...args) {
    args.forEach((m) => {
      if (m instanceof Matrix) {
        const v = dotArrays(this.value, m.value);
        this.copyFrom(v);
      }
    });
    return this;
  }

  scale(factor) {
    if (Number.isFinite(factor)) {
      this._values.assign(v => v * factor);
    }
    return this;
  }

  negate() {
    this._values.assign(v => -v);
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

  // TODO
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
      inverse = _findInverse(this.toArray());
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

