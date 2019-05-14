import Vector from './vector';
import { clampValue, dotArrays } from './internal';

const _fillIdentity = (size) => {
  const values = new Array(size);
  for (let r = 0, c = 0; r < size; r++, c++) {
    values[r] = new Array(size).fill(0);
    values[r][c] = 1;
  }
  return values;
};

function _calcDeterminant(m) {
  if (!m.isSquare()) {
    throw new TypeError('Matrix must be a square!');
  }
  if (m.rows === 1) return m._values[0][0];

  let d = 0;

  for (let c = 0; c < m.cols; c++) {
    const v = m._values[0][c];
    if (v === 0) continue;
    const sm = m.remove(1, c + 1);
    let cofactor = _calcDeterminant(sm);

    if (c % 2 === 1) {
      cofactor = -cofactor;
    }
    d += v * cofactor;
  }
  return d;
}

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

class Matrix {
  constructor(rows, cols) {
    if (Array.isArray(rows) && Array.isArray(rows[0]) && !cols) {
      this._values = rows;
    } else {
      rows = rows || 4;
      cols = cols || rows;

      const v = new Array(rows);
      for (let r = 0; r < rows; r++) {
        v[r] = new Array(cols).fill(0);
      }
      this._values = v;
    }
  }

  static identity(size = 4) {
    return new Matrix(_fillIdentity(size));
  }

  static fromVector(vect) {
    const values = vect.value.map(v => [v]);
    return new Matrix(values);
  }

  clone() {
    const m = new Matrix(this._values.map(r => [...r]));
    return m;
  }

  set(i, j, v) {
    if (i > 0 && i <= this.rows && j > 0 && j <= this.cols && Number.isFinite(v)) {
      this._values[i - 1][j - 1] = v;
    }
    return this;
  }

  get(i, j) {
    return this._values[i - 1][j - 1];
  }

  assign(assignFunc) {
    let i = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this._values[r][c] = assignFunc(this._values[r][c], r + 1, c + 1, i++);
      }
    }
    return this;
  }

  row(i) {
    if (i > 0 && i <= this.rows) {
      return this._values[i - 1];
    }
    throw Error('Invalid arguments!');
  }

  col(j) {
    if (j > 0 && j <= this.cols) {
      return this._values.map(r => r[j - 1]);
    }
    throw Error('Invalid arguments!');
  }

  clamp(min = 0, max = 1) {
    this.assign(v => clampValue(v, min, max));
    return this;
  }

  fill(...values) {
    if (values.length === 1 && Array.isArray(values[0])) {
      [values] = values;
    }

    if (values.length === 1) {
      this.assign(() => values[0]);
    } else {
      this.assign((v, i, j, n) => (n < values.length ? values[n] : 0));
    }
    return this;
  }

  toColumns() {
    const cols = new Array(this.cols);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (cols[c] === undefined) {
          cols[c] = new Array(this.rows);
        }
        cols[c][r] = this._values[r][c];
      }
    }
    return cols;
  }

  transpose() {
    this._values = this.toColumns();

    return this;
  }

  add(m) {
    return this.clone().addFrom(m);
  }

  sub(m) {
    return this.clone().subFrom(m);
  }

  addFrom(m) {
    if (this.rows !== m.rows || this.cols !== m.cols)
      throw Error('Incompatible matrices!');

    this.assign((v, i, j) => v + m._values[i - 1][j - 1]);

    return this;
  }

  subFrom(m) {
    if (this.rows !== m.rows || this.cols !== m.cols)
      throw Error('Incompatible matrices!');

    this.assign((v, i, j) => v - m._values[i - 1][j - 1]);

    return this;
  }

  dot(arg) {
    let m2;

    const bIsVec = arg instanceof Vector;

    const m1 = this.value;

    if (bIsVec) {
      m2 = arg.value.map(v => [v]);
    } else {
      m2 = arg.value || arg;
    }

    const v = dotArrays(m1, m2);

    if (bIsVec) {
      return new Vector(v.map(c => c[0])).dimensions(arg.dim);
    }

    return new Matrix(v);
  }

  scale(factor) {
    if (Number.isFinite(factor)) {
      this.assign(v => v * factor);
    }
    return this;
  }

  submatrix(i = 1, j = 1, rows = 2, cols = 2) {
    if (rows < 1 || cols < 1) throw Error('Invalid arguments!');

    const sub = new Array(rows);

    for (let r = 0; r < rows; r++) {
      sub[r] = new Array(cols);
      for (let c = 0; c < cols; c++) {
        sub[r][c] = this._values[i - 1 + r][j - 1 + c];
      }
    }
    return new Matrix(sub);
  }

  remove(i = 0, j = 0) {
    if (!i && !j) return this.clone();

    if (i > this.rows || j > this.cols)
      throw Error('Invalid arguments!');

    const sub = [];

    for (let r = 0; r < this.rows; r++) {
      if (r + 1 !== i) {
        sub.push(j ?
          this._values[r].filter((v, idx) => idx !== j - 1) :
          this._values[r],
        );
      }
    }

    const m = new Matrix(sub);
    return m;
  }

  det() {
    if (!this.isSquare()) throw Error('Matrix must be square!');

    const v = this.value;

    if (this.rows === 1) {
      return v[0][0];
    } else if (this.rows === 2) {
      return v[0][0] * v[1][1] - v[1][0] * v[0][1];
    }
    return _calcDeterminant(this);
  }

  inverse() {
    if (!this.isSquare()) throw Error('Matrix must be square!');

    const inverse = _findInverse(this.clone()._values);

    if (inverse) {
      return new Matrix(inverse);
    }
    return undefined;
  }

  invert() {
    const inverse = this.inverse();
    if (inverse) {
      this._values = inverse;
    } else {
      throw Error('Matrix cannot be inverted!');
    }
    return this;
  }

  isSquare() {
    return this.rows === this.cols;
  }

  flatten() {
    const arr = new Array(this.rows * this.cols);

    for (let r = 0; r < this.rows; r++) {
      const ri = r * this.cols;
      for (let c = 0; c < this.cols; c++) {
        arr[ri + c] = this._values[r][c];
      }
    }
    return arr;
  }

  toVectors() {
    return this.toColumns().map(v => new Vector(v));
  }

  get rows() {
    return this._values.length;
  }

  get cols() {
    return this._values[0].length;
  }

  get value() {
    return this._values;
  }

  get size() {
    return [this.rows, this.cols];
  }

  get ascii() {
    if (!this.value || this.value.length === 0) return '<empty>';
    const str = this.value.reduce(
      (s, v) => `${s + v.join('\t')}\n`,
      '',
    );
    return str;
  }

  get html() {
    return `<pre><code>${this.ascii}</code></pre>`;
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

export default Matrix;

export const mat2 = (...values) => new Matrix(2, 2).fill(...values);
export const mat3 = (...values) => new Matrix(3, 3).fill(...values);
export const mat4 = (...values) => new Matrix(4, 4).fill(...values);

export const col2 = (...values) => new Matrix(2, 1).fill(...values);
export const col3 = (...values) => new Matrix(3, 1).fill(...values);
export const col4 = (...values) => new Matrix(4, 1).fill(...values);

export const row2 = (...values) => new Matrix(1, 2).fill(...values);
export const row3 = (...values) => new Matrix(1, 3).fill(...values);
export const row4 = (...values) => new Matrix(1, 4).fill(...values);

