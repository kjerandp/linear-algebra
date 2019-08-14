import { rowsToColumns } from './utils';
import { scale } from './functions';

/**
 * A class for storing values in rows and columns and for doing
 * common matrix operations. As the Vector class, this extends the
 * js Array class.
 *
 * Values are stores columns-first internally, but is normally
 * instantiated by supplying values in rows-first order.
 */
export class Matrix extends Array {
  /**
   * Creates an identity matrix with rows and columns equal to size.
   * @param {number} size dimension
   * @return {Matrix}
   */
  static identity(size = 4) {
    const m = new Matrix(size).fill(0);
    for (let i = 0; i < m.length; i += size + 1) {
      m[i] = 1;
    }
    return m;
  }

  /**
   * Traverse an array as a matrix, either rows-first or columns first.
   * @param {number[]} arr array to traverse as a matrix
   * @param {number} cols number of columns to split the array into
   * @param {function} callback function to be executed for each element
   * @param {boolean} rowsFirst traverse order
   */
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

  /**
   * Instantiate a matrix from an array.
   * @param {number[]} arr array of numbers
   * @param {number} columns number of columns to split the array into
   * @param {boolean} rowsFirst traverse order
   * @param {boolean} mutateArgs set if the input array should be mutated or not
   * @return {Matrix}
   */
  static fromArray(arr, columns = 1, rowsFirst = true, mutateArgs = false) {
    const rows = columns === 1 ? arr.length : ~~(arr.length / columns);

    return new Matrix(rows, columns, arr, rowsFirst, mutateArgs);
  }

  /**
   * Create a matrix from vectors. Each vector will be a column in the matrix
   * and the number of rows are determined by the vector dimension.
   * @param  {...number[]} vectors
   * @return {Matrix}
   */
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

  /**
   * Constructs a new instance of Matrix. If cols is omitted, it will mirror the rows
   * parameter, making a square matrix.
   * @param {number} rows number of rows
   * @param {number} cols number of columns
   * @param {number[]} values array of numbers to assign to the matrix elements
   * @param {boolean} rowsFirst if values should be read rows-first or columns-first
   * @param {boolean} mutateArgs set if the input array should be mutated or not
   */
  constructor(rows = 4, cols, values, rowsFirst = true, mutateArgs = false) {
    cols = cols || rows;
    super(rows * cols);
    /** internal property to hold number of columns of this matrix */
    this._c = cols;
    /** internal property to hold number of rows of this matrix */
    this._r = rows;

    if (values) {
      if (values.length === 1 && Array.isArray(values[0])) {
        [values] = values;
      }
      this.copyFrom(values, rowsFirst, mutateArgs);
    }
  }

  /**
   * Set values of this matrix from an array
   * @param {number[]} values array of numbers
   * @param {boolean} rowsFirst if values should be read rows-first or columns-first
   * @param {number} mutateArgs
   */
  copyFrom(values, rowsFirst = true, mutateArgs = false) {
    if (!rowsFirst) {
      for (let i = 0; i < Math.min(this.length, values.length); i++) {
        /** assign value */
        this[i] = values[i];
      }
    } else {
      if (values.length > this.length) {
        if (mutateArgs) {
          values.length = this.length;
        } else {
          values = values.slice(0, this.length);
        }
      }
      rowsToColumns(values, this.columns, this);
    }
    return this;
  }

  /**
   * Traverse this matrix
   * @param {function} callback function to be executed for each element
   * @param {boolean} rowsFirst if values should be read rows-first or columns-first
   * @return {Matrix} returns itself for chaining
   */
  traverse(callback = () => ({}), rowsFirst = true) {
    Matrix.traverse(this, this.columns, callback, rowsFirst);
    return this;
  }

  /**
   * Clone/copy this matrix
   * @return {Matrix}
   */
  clone() {
    return new Matrix(this.rows, this.columns, this, false);
  }

  /**
   * Calculate the internal 1d array index
   * @param {number} row row index (zero-based)
   * @param {number} col column index (zero-based)
   */
  index(row, col) {
    return this.rows * col + row;
  }

  /**
   * Get a matrix element value by row and column
   * @param {number} row row index (zero-based)
   * @param {number} col column index (zero-based)
   * @return {number}
   */
  get(row, col) {
    const idx = this.index(row, col);
    return this[idx];
  }

  /**
   * Set a value at the specified row and column
   * @param {number} row row index (zero-based)
   * @param {number} col column index (zero-based)
   * @param {number} value value to set
   * @return {Matrix} returns itself for chaining
   */
  set(row, col, value) {
    const idx = this.index(row, col);
    /** assign value */
    this[idx] = value;
    return this;
  }

  /**
  * Calculate the matrix matrix product between this matrix and the passed matrices.
  * in the order they appear.
  *
  * The left hand matrix number of columns must always match the right hand matrix number of rows.
  * @param  {...Matrix} matrices
  * @return {Matrix}
  */
  dotMat(...matrices) {
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

  /**
  * Calculate the matrix vector product between this matrix and the passed arrays/vectors.
  *
  * Since it is common to use homogeneous coordinates when doing matrix-vector multiplication,
  * i.e. use 4x4 matrix for transforming 3d vectors, the vectors will be treated as if they had
  * the same number of components as the matrix has columns. For vectors with a lower dimension
  * than the number of columns in the matrix, the last component will be iterpreted as 1 and any
  * in between as 0. In the opposite case, it will simply neglect excessive components.
  * @param  {number[]} vec vector (as Array/Vector)
  * @param {Vector|number[]} target optional array/vector to avoid mutating the vec argument
  * @return {number[]} resulting vector (type depending on vec/target argument)
  */
  dotVec(vec, target = null) {
    if (target) { // optimized for immutable input vector
      for (let c = 0; c < this.columns; c++) {
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

    for (let c = 0; c < this.columns; c++) {
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
    if (vec.length > this.rows) {
      vec.length = this.rows;
    }
    return vec;
  }

  /**
   * Calculate the matrix-matrix or matrix-vector product, depending on the type of
   * the argument passed to the other-parameter.
   * @param {number[]|Vector|Matrix} other {Array/Vector/Matrix}
   * @param {Vector|number[]} target optional array/vector to avoid mutating input argument
   * @return {Matrix|Vector|number[]} depending on input.
   */
  dot(other, target = null) {
    if (other instanceof Matrix) {
      return this.dotMat(other);
    }
    return this.dotVec(other, target);
  }

  /**
   * Get the values from a specific column.
   * @param {number} j zero-based column index
   * @param {Vector|number[]} target optional array/vector to write values to
   * @return {number[]} column values
   */
  col(j, target = null) {
    target = target || new Array(this.rows);
    const idx = j * this.rows;

    for (let i = idx; i < idx + this.rows; i++) {
      target[i - idx] = this[i];
    }
    return target;
  }

  /**
   * Get the values from a specific row.
   * @param {number} i zero-based row index
   * @param {Vector|number[]} target optional array/vector to write values to
   * @return {number[]} row values
   */
  row(i, target = null) {
    target = target || new Array(this.columns);

    for (let j = 0; j < this.columns; j++) {
      target[j] = this[i + j * this.rows];
    }
    return target;
  }

  /**
   * Create a submatrix from this matrix.
   * @param {number} row zero-based row index
   * @param {number} col zero-based column index
   * @param {number} rows number of rows to include
   * @param {number} cols number of columns to include
   * @param {Matrix|number[]} target optional array/matrix to write values to
   * @return {Matrix} submatrix
   */
  submatrix(row = 0, col = 0, rows = 2, cols = 2, target = null) {
    const start = this.index(row, col);
    const end = start + cols * this.rows;

    let subm;
    if (target) {
      if (target instanceof Matrix) {
        target._c = cols;
        target._r = rows;
        target.length = rows * cols;
      }
      subm = target;
    } else {
      subm = new Matrix(rows, cols);
    }

    let k = 0;
    for (let i = start; i < end; i += this.rows) {
      for (let j = 0; j < rows; j++) {
        subm[k++] = this[i + j];
      }
    }
    return subm;
  }

  /**
   * Remove a row and/or column from this matrix
   * @param {number} row zero-based row index (-1 or null to omit)
   * @param {number} col zero-based column index (-1 or null to omit)
   * @param {Matrix} target optional matrix to avoid mutating this matrix
   * @return {Matrix} reduced matrix
   */
  remove(row = null, col = null, target = null) {
    if (target && target instanceof Matrix) {
      target._r = this._r;
      target._c = this._c;
      target.length = this.length;
      target.copyFrom(this, false);
    } else {
      target = this;
    }

    let idx;
    if (Number.isFinite(col) && col >= 0 && col < target.columns) {
      idx = col * target.rows;
      target.splice(idx, target.rows);
      target._c--;
    }
    if (Number.isFinite(row) && row >= 0 && row < target.rows) {
      for (let r = 0; r < target.columns; r++) {
        idx = r * target.rows + row - r;
        target.splice(idx, 1);
      }
      target._r--;
    }
    return target;
  }

  /**
   * Transpose this matrix (switch rows and columns)
   * @param {Matrix|number[]} target optional array/matrix to avoid mutating this matrix
   * @return {Matrix} transposed matrix
   */
  transpose(target = null) {
    const cols = this.rows;
    if (!target) {
      target = this;
    } else {
      target.length = this.length;
    }
    if (target instanceof Matrix) {
      target._r = this._c;
      target._c = cols;
    }
    rowsToColumns(this, cols, target);
    return target;
  }

  /**
   * Invert this matrix (where applicable)
   * @param {Matrix} target optional matrix to avoid mutating this matrix
   * @return {Matrix} transposed matrix
   */
  inverse(target = null) {
    if (!this.isSquare) throw Error('Matrix must be square!');

    const dim = this.rows;
    if (target && target instanceof Matrix) {
      target._c = this.columns;
      target._r = this.rows;
      target.length = this.length;
      target.copyFrom(this, false);
    } else {
      target = this;
    }
    const src = Matrix.identity(dim);

    for (let i = 0; i < dim; i++) {
      const d = target.index(i, i);
      let e = target[d];
      // if we have a 0 on the diagonal (we'll need to swap with a lower row)
      if (e === 0) {
        // look through every row below the i'th row
        for (let ii = i + 1; ii < dim; ii += 1) {
          // if the ii'th row has a non-0 in the i'th col
          if (target.get(ii, i) !== 0) {
            // it would make the diagonal have a non-0 so swap it
            for (let j = 0; j < dim; j++) {
              const ij = target.index(i, j);
              const iij = target.index(ii, j);
              e = target[ij]; // temp store i'th row
              target[ij] = target[iij]; // replace i'th row by ii'th
              target[iij] = e; // repace ii'th by temp
              e = src[ij]; // temp store i'th row
              src[ij] = src[iij]; // replace i'th row by ii'th
              src[iij] = e; // repace ii'th by temp
            }
            // don't bother checking other rows since we've swapped
            break;
          }
        }
        // get the new diagonal
        e = target[d];
        // if it's still 0, not srcertable (error)
        if (e === 0) return undefined;
      }

      // Scale this row down by e (so we have a 1 on the diagonal)
      for (let j = 0; j < dim; j++) {
        const ij = target.index(i, j);
        target[ij] /= e; // apply to original thisrix
        src[ij] /= e; // apply to identity
      }

      // Subtract this row (scaled appropriately for each row) from ALL of
      // the other rows so that there will be 0's in this column in the
      // rows above and below this one
      for (let ii = 0; ii < dim; ii++) {
        // Only apply to other rows (we want a 1 on the diagonal)
        if (ii === i) continue;

        // We want to change this element to 0
        e = target.get(ii, i);

        // Subtract (the row above(or below) scaled by e) from (the
        // current row) but start at the i'th column and assume all the
        // stuff left of diagonal is 0 (which it should be if we made this
        // algorithm correctly)
        for (let j = 0; j < dim; j++) {
          const ij = target.index(i, j);
          const iij = target.index(ii, j);
          target[iij] -= e * target[ij]; // apply to original matrix
          src[iij] -= e * src[ij]; // apply to identity
        }
      }
    }
    return src;
  }

  /**
   * Calculate this matrix's determinant (where applicable)
   * @return {number} the determinant
   */
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
        const v = m[c * m.rows];
        if (v === 0) continue;
        const sm = m.remove(0, c, new Matrix());
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

  /**
   * Scale this vector by a factor
   * @param {number} factor scaling factor
   * @param {Matrix|number[]} target optional array/matrix to avoid mutating this matrix
   * @return {Matrix}
   */
  scale(factor, target = null) {
    return scale(this, factor, target || this);
  }

  /**
   * Returns a native javascript Array representation of this matrix, in rows-first order
   * @return {number[]}
   */
  columnsFirst() {
    return [...this];
  }

  /**
   * Returns a native javascript Array representation of this matrix, in column-first order
   * @return {number[]}
   */
  rowsFirst() {
    const res = new Array(this.length);
    rowsToColumns(this, this.rows, res);
    return res;
  }

  /**
   * Return a native javascript Array representation of this matrix.
   * @param {boolean} rowsFirst if the output should be rows-first or columns-first
   * @return {number[]}
   */
  toArray(rowsFirst = false) {
    return rowsFirst ? this.rowsFirst() : this.columnsFirst();
  }

  /**
   * Returns a 2d native javascript Array representation of this matrix.
   * @param {boolean} rowsFirst if the output should be rows-first or columns-first
   * @return {Array<Array>}
   */
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

  /**
   * Get the number of columns in this matrix.
   * @return {number}
   */
  get columns() {
    return this._c;
  }

  /**
   * Get the number of rows in this matrix.
   * @return {number}
   */
  get rows() {
    return this._r;
  }

  /**
   * This function returns true if this matrix has the same number of rows as columns,
   * otherwise false.
   * @return {boolan}
   */
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

/**
 * Factory function for creating and assigning a matrix from an array.
 * The array must be 1 dimensional, and will be split into rows and columns based
 * on the specified cols parameter. If array length divided by cols doesn't add up
 * to a whole number, then only floor(args.length / cols) values will be read from
 * the input array.
 *
 * Initial values are passed in row-first order by default, but can optionally
 * be passed in columns-first by setting the rowFirst argument to false.
 * @param  {...number} arr initial values
 * @param {number} cols number of columns to split the array into
 * @param {boolean} rowsFirst read arr in rows-first or column-first order
 * @return {Matrix}
 */
export function mat(arr, cols, rowsFirst = true) {
  return Matrix.fromArray(arr, cols, rowsFirst, true);
}

/**
 * Factory function for creating and assigning a 2x2 matrix.
 * Initial values are passed in row-first order.
 * @param  {...number} args initial values
 * @return {Matrix}
 */
export function mat2(...args) {
  return new Matrix(2, 2, args, true, true);
}

/**
 * Factory function for creating and assigning a 3x3 matrix.
 * Initial values are passed in row-first order.
 * @param  {...number} args initial values
 * @return {Matrix}
 */
export function mat3(...args) {
  return new Matrix(3, 3, args, true, true);
}

/**
 * Factory function for creating and assigning a 4x4 matrix.
 * Initial values are passed in row-first order.
 * @param  {...number} args initial values
 * @return {Matrix}
 */
export function mat4(...args) {
  return new Matrix(4, 4, args, true, true);
}
