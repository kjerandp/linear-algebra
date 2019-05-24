import { argumentsToList } from './utils';

export default class Array2d extends Array {
  constructor(values, columns = 0, rows, initValue) {
    if (values && values.length) {
      if (values instanceof Array2d) {
        columns = columns || values.cols;
      } else if (!columns && values.length > 0 && values[0].length) {
        columns = values[0].length;
      }
      values = argumentsToList(values);
      super(values.length);
      this._set(values);
    } else if (values > 0) { // size
      const size = values;
      super(size);
    } else {
      super();
    }

    if (!Number.isFinite(columns)) throw Error('Columns not a number!');
    this._c = columns; // if zero columns => treat as regular array

    if (rows > 0 && this._c > 0) {
      this.init(rows, initValue, true);
    }
  }

  static from(iterable, cols = 0) {
    const arr = Array.from(iterable);
    const na = new Array2d(arr, cols);
    return na;
  }

  _set(values) {
    if (this.length > values.length) {
      this.splice(values.length);
    }
    for (let i = 0; i < values.length; i++)
      this[i] = values[i];
  }

  set(...args) {
    this._set(argumentsToList(args));
    return this;
  }

  index(c = 0, r = 0) {
    if (r >= this.rows || c >= this.cols) return undefined;
    return r * this._c + c;
  }

  position(idx) {
    if (this._c === 0 || this._c > idx)
      return [idx, 0];

    const r = ~~(idx / this._c);
    const c = (idx % this._c);

    return [c, r];
  }

  clone() {
    return new Array2d([...this], this._c);
  }

  init(rows, value = undefined, preserve = false) {
    if (this._c === 0) {
      this._c = this.length;
    }
    const l = rows * this._c;
    if (this.length > l) {
      this.splice(l);
    }

    for (let i = preserve ? this.length : 0; i < l; i++) {
      this[i] = value;
    }

    return this;
  }

  assign(func) {
    for (let n = 0; n < this.length; n++) {
      const [c, r] = this.position(n);
      this[n] = func(this[n], c, r, n);
    }
    return this;
  }

  copyFrom(arg) {
    const values = argumentsToList(arg);
    for (let i = 0; i < values.length && i < this.length; i++) {
      this[i] = values[i];
    }
    return this;
  }

  forEach(func, inRowMajor = true) {
    if (inRowMajor) {
      for (let n = 0; n < this.length; n++) {
        const [c, r] = this.position(n);
        func(this[n], n, c, r);
      }
    } else {
      const { rows, cols } = this;
      let n = 0;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          func(this[r * cols + c], n++, c, r);
        }
      }
    }
    return this;
  }

  map(func) {
    const arr = new Array(this.length);
    for (let n = 0; n < this.length; n++) {
      const [c, r] = this.position(n);
      arr[n] = func(this[n], n, c, r);
    }
    return arr;
  }

  reduce(func, init) {
    return super.reduce((acc, v, i) => {
      const [c, r] = this.position(i);
      return func(acc, v, i, c, r);
    }, init);
  }

  getValueAt(c, r = 0) {
    return this[this.index(c, r)];
  }

  setValueAt(c, r, v) {
    this[this.index(c, r)] = v;
    return this;
  }

  getRow(i) {
    if (i > 0 && i <= this.rows) {
      const { cols } = this;
      const row = new Array(cols);
      for (let c = 0; c < cols; c++) {
        row[c] = this.getValueAt(c, i - 1);
      }
      return row;
    }
    throw Error('Invalid arguments!');
  }

  getColumn(j) {
    if (j > 0 && j <= this.cols) {
      const { rows } = this;
      const col = new Array(rows);
      for (let r = 0; r < rows; r++) {
        col[r] = this.getValueAt(j - 1, r);
      }
      return col;
    }
    throw Error('Invalid arguments!');
  }

  transpose() {
    if (this._c === 0) this._c = this.length;
    const tc = this.rows;
    const transposed = this.toArray(1, false);
    this._c = tc;
    return this.copyFrom(transposed);
  }

  copy(col = 0, row = 0, cols = 0, rows = 0) {
    if (col === 0 && row === 0) {
      return this.clone();
    }
    if (rows < 1 || cols < 1) throw Error('Invalid arguments!');

    const sub = new Array(rows * cols);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        sub[r * cols + c] = this.getValueAt(col - 1 + c, row - 1 + r);
      }
    }
    return new Array2d(sub, cols);
  }

  remove(col = 0, row = 0) {
    let pos;
    const { cols } = this;
    if (row > 0) {
      pos = this.index(0, row - 1);
      this.splice(pos, cols);
    }

    if (col > 0) {
      for (let i = 0, j = 0; i < this.length; i += cols, j++) {
        this.splice(i - j + col - 1, 1);
      }
      this._c = cols - 1;
    }
    return this;
  }

  columns(n) {
    this._c = Math.max(0, n);
    return this;
  }

  toArray(dim = 1, inRowMajor = true) {
    const { rows, cols } = this;
    const i = inRowMajor ? rows : cols;
    const j = inRowMajor ? cols : rows;
    const arr = new Array(dim === 2 ? i : i * j);
    for (let ii = 0; ii < i; ii++) {
      if (dim === 2) {
        arr[ii] = new Array(j);
      }
      for (let jj = 0; jj < j; jj++) {
        const v = this.getValueAt(inRowMajor ? jj : ii, inRowMajor ? ii : jj);
        if (dim === 2) {
          arr[ii][jj] = v;
        } else {
          arr[ii * j + jj] = v;
        }
      }
    }
    return arr;
  }

  get isSquare() {
    return this.rows === this.cols;
  }

  get cols() {
    if (this._c === 0) return this.length;
    return this._c;
  }

  set cols(n) {
    this.columns(n);
    return this._c;
  }

  get rows() {
    if (this._c === 0) return 1;
    return Math.ceil(this.length / this._c);
  }

  set rows(n) {
    this.init(n, undefined, true);
    return n;
  }

  get size() {
    return [this.rows, this.cols];
  }

  get rowMajor() {
    const _t = this;
    const { rows, cols } = _t;
    return {
      * [Symbol.iterator]() {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            yield _t.getValueAt(c, r);
          }
        }
      },
    };
  }

  get columnMajor() {
    if (this._c === 0) return this.rowMajor;
    const _t = this;
    const { rows, cols } = _t;
    return {
      * [Symbol.iterator]() {
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            yield _t.getValueAt(c, r);
          }
        }
      },
    };
  }
}
