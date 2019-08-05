import { flattenList, rowsToColumns } from './utils';

// values are stored columns first, base zero
class Matrix extends Array {
  static identity(size = 4) {
    const m = new Matrix(size).fill(0);
    for (let i = 0; i < m.length; i += size + 1) {
      m[i] = 1;
    }
    return m;
  }

  static traverse(arr, cols = 1, callback = () => ({}), rowsFirst = true) {
    const rows = arr.rows || ~~(arr.length / cols);
    if (rowsFirst) {
      let n = 0;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const idx = c * rows + r;
          callback(arr[idx], n++, r, c, idx);
        }
      }
    } else {
      arr.forEach((v, i) => callback(v, i, i % cols, ~~(i / rows), i));
    }
  }

  static fromArray(arr, columns = 1) {
    const rows = columns === 1 ? arr.length : ~~(arr.length / columns);
    return new Matrix(rows, columns, arr);
  }

  static fromVectors(...vectors) {
    const cols = vectors.length;
    const rows = vectors[0].length;
    const m = new Matrix(rows, cols);
    let n = 0;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        m[n++] = vectors[i][j];
      }
    }
    return m;
  }

  constructor(rows = 4, cols, ...args) {
    cols = cols || rows;
    super(rows * cols);
    this._c = cols;
    this._r = rows;

    if (args.length > 0) this.copyFrom(args);
  }

  copyFrom(values, flatten = true) {
    rowsToColumns(flatten ? flattenList(values) : values, this.columns, this);
  }

  traverse(callback = () => ({}), rowsFirst = true) {
    Matrix.traverse(this, this.columns, callback, rowsFirst);
  }

  clone() {
    return new Matrix(this.rows, this.columns, this);
  }

  index(row, col) {
    return this.rows * col + row;
  }

  get(row, col) {
    const idx = this.index(row, col);
    return this[idx];
  }

  set(row, col, value) {
    const idx = this.index(row, col);
    this[idx] = value;
    return this;
  }


  dot(...matrices) {
    let m = this;
    let target = this;
    matrices.forEach((other) => {
      target = m.clone();
      if (m.columns !== other.rows) throw Error('Columns of left hand matrix must match rows of right hand matrix!');
      let idx = 0;
      for (let c = 0; c < other.columns; c++) {
        for (let r = 0; r < m.rows; r++) {
          let sum = 0;
          for (let n = 0; n < m.columns; n++) {
            sum += m.get(r, n) * other.get(n, c);
          }
          target[idx++] = sum;
        }
      }
      m = target;
    });
    return target;
  }

  dotVec(vec, target = null) {
    if (target) { // optimized for immutable input vector
      for (let c = 0; c < this.rows; c++) {
        const n = c * this.rows;
        for (let r = 0; r < target.length; r++) {
          if (c === 0) target[r] = 0;
          let compVal = 0;
          if (c < vec.length) {
            compVal = vec[c];
          } else if (c === this.rows - 1) {
            compVal = 1;
          }
          target[r] += this[n + r] * compVal;
        }
      }
      return target;
    }
    // optimized for mutation of input vector
    const comp = new Array(vec.length);
    for (let i = 0; i < vec.length; i++) {
      comp[i] = vec[i];
      vec[i] = 0;
    }

    for (let c = 0; c < this.rows; c++) {
      const n = c * this.rows;
      for (let r = 0; r < vec.length; r++) {
        let compVal = 0;
        if (c < comp.length) {
          compVal = comp[c];
        } else if (c === this.rows - 1) {
          compVal = 1;
        }
        vec[r] += this[n + r] * compVal;
      }
    }
    return vec;
  }

  col(j, target = null) {
    target = target || new Array(this.rows);
    const idx = j * this.rows;

    for (let i = idx; i < idx + this.rows; i++) {
      target[i - idx] = this[i];
    }
    return target;
  }

  row(i, target = null) {
    target = target || new Array(this.columns);

    for (let j = 0; j < this.columns; j++) {
      target[j] = this[i + j * this.rows];
    }
    return target;
  }

  submatrix(row = 0, col = 0, rows = 2, cols = 2) {
    const start = this.index(row, col);
    const end = start + cols * this.rows;
    const subm = new Matrix(rows, cols);
    let k = 0;
    for (let i = start; i < end; i += this.rows) {
      for (let j = 0; j < rows; j++) {
        subm[k++] = this[i + j];
      }
    }
    return subm;
  }

  remove(row = -1, col = -1, mutate = false) {
    const target = mutate ? this : this.clone();
    if (col > -1 && col < target.columns) {
      const idx = col * target.rows;
      target.splice(idx, target.rows);
      target._c--;
    }
    if (row > -1 && row < target.rows) {
      for (let c = target.columns - 1; c >= 0; c--) {
        target.splice(row + c * target.rows, 1);
      }
      target._r--;
    }
    return target;
  }

  transpose(target = null) {
    const cols = this.rows;
    if (!target) {
      target = this;
      target._r = this._c;
      target._c = cols;
    }
    rowsToColumns(this, cols, target);
    return target;
  }

  inverse() {
    if (!this.isSquare) throw Error('Matrix must be square!');

    const dim = this.rows;
    const inv = Matrix.identity(dim);

    for (let i = 0; i < dim; i++) {
      const d = this.index(i, i);
      let e = this[d];
      // if we have a 0 on the diagonal (we'll need to swap with a lower row)
      if (e === 0) {
        // look through every row below the i'th row
        for (let ii = i + 1; ii < dim; ii += 1) {
          // if the ii'th row has a non-0 in the i'th col
          if (this.get(ii, i) !== 0) {
            // it would make the diagonal have a non-0 so swap it
            for (let j = 0; j < dim; j++) {
              const ij = this.index(i, j);
              const iij = this.index(ii, j);
              e = this[ij]; // temp store i'th row
              this[ij] = this[iij]; // replace i'th row by ii'th
              this[iij] = e; // repace ii'th by temp
              e = inv[ij]; // temp store i'th row
              inv[ij] = inv[iij]; // replace i'th row by ii'th
              inv[iij] = e; // repace ii'th by temp
            }
            // don't bother checking other rows since we've swapped
            break;
          }
        }
        // get the new diagonal
        e = this[d];
        // if it's still 0, not invertable (error)
        if (e === 0) return undefined;
      }

      // Scale this row down by e (so we have a 1 on the diagonal)
      for (let j = 0; j < dim; j++) {
        const ij = this.index(i, j);
        this[ij] /= e; // apply to original thisrix
        inv[ij] /= e; // apply to identity
      }

      // Subtract this row (scaled appropriately for each row) from ALL of
      // the other rows so that there will be 0's in this column in the
      // rows above and below this one
      for (let ii = 0; ii < dim; ii++) {
        // Only apply to other rows (we want a 1 on the diagonal)
        if (ii === i) continue;

        // We want to change this element to 0
        e = this.get(ii, i);

        // Subtract (the row above(or below) scaled by e) from (the
        // current row) but start at the i'th column and assume all the
        // stuff left of diagonal is 0 (which it should be if we made this
        // algorithm correctly)
        for (let j = 0; j < dim; j++) {
          const ij = this.index(i, j);
          const iij = this.index(ii, j);
          this[iij] -= e * this[ij]; // apply to original matrix
          inv[iij] -= e * inv[ij]; // apply to identity
        }
      }
    }
    return inv;
  }

  determinant() {
    if (!this.isSquare) throw Error('Matrix must be square!');

    if (this.rows === 2) {
      return this[0] * this[3] - this[2] * this[1];
    } else if (this.rows === 3) {
      return this[0] * this[4] * this[8] - this[6] * this[4] * this[2] +
        this[3] * this[7] * this[2] - this[0] * this[7] * this[5] +
        this[6] * this[1] * this[5] - this[3] * this[1] * this[8];
    }

    function determinantRec(m) {
      if (m.length === 1) return m[0];

      let d = 0;
      for (let c = 0; c < m.columns; c++) {
        const v = m[c];
        if (v === 0) continue;
        const sm = m.remove(0, c, false);
        let cofactor = determinantRec(sm);

        if (c % 2 === 1) {
          cofactor = -cofactor;
        }
        d += v * cofactor;
      }
      return d;
    }

    return determinantRec(this);
  }

  columnsFirst() {
    return [...this];
  }

  rowsFirst() {
    const res = new Array(this.length);
    this.traverse((v, i) => { res[i] = v; });
    return res;
  }

  toArray2d(rowsFirst = false) {
    const res = new Array(rowsFirst ? this.rows : this.columns);
    const cf = rowsFirst ?
      (v, i, r, c) => {
        if (!res[r]) res[r] = new Array(this.columns);
        res[r][c] = v;
      } :
      (v, i, r, c) => {
        if (!res[c]) res[c] = new Array(this.rows);
        res[c][r] = v;
      };

    this.traverse(cf);
    return res;
  }

  get columns() {
    return this._c;
  }

  get rows() {
    return this._r;
  }

  get isSquare() {
    return this.rows === this.columns;
  }
}

// add extra accessors
for (let i = 1; i <= 4; i++) {
  for (let j = 1; j <= 4; j++) {
    Object.defineProperty(Matrix.prototype, `a${i}${j}`, {
      get() {
        return this.get(i - 1, j - 1);
      },
      set(v) {
        this.set(i - 1, j - 1, v);
      },
    });
  }
}

export default Matrix;

export function mat(arr, cols) {
  return Matrix.fromArray(arr, cols);
}

export function mat2(...args) {
  return new Matrix(2, 2, args);
}

export function mat3(...args) {
  return new Matrix(3, 3, args);
}

export function mat4(...args) {
  return new Matrix(4, 4, args);
}
