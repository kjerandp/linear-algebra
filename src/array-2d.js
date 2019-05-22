import { argumentsToList } from './utils';
import { EPSILON } from './constants';


const numberTypeInterface = {
  default: () => 0,
  zero: () => 0,
  unitValue: () => 1,
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  negate: v => -v,
  isZero: v => Math.abs(v) < EPSILON,
  isLessThan: (a, b) => a < b,
  isDefined: v => v !== undefined && v !== null && Number.isFinite(v),
};

const clampFunc = (min, max, op = numberTypeInterface) => (v) => {
  if (op.isLessThan(v, min)) return min;
  if (op.isLessThan(max, v)) return max;
  return v;
};

export default class Array2d extends Array {
  constructor(values, columns = 0, rows, valueInterface) {
    if (values && values.length) {
      if (!columns && values.length > 0 && values[0].length) {
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

    this._op = valueInterface || numberTypeInterface;
    this._c = columns; // if zero columns => treat as regular array

    if (rows > 0 && this._c > 0) {
      this.init(rows, this._op.default(), true);
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
    // if (this._c === 0 && r === 0) return c;
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
    return new Array2d([...this], this._c, 0, this._op);
  }

  init(rows, value = undefined, preserve = false) {
    if (this._c === 0) {
      throw Error('Columns not set!');
    }
    const l = rows * this._c;
    if (this.length > l) {
      this.splice(l);
    }

    if (value === undefined) {
      value = this._op.default();
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

  forEach(func) {
    for (let n = 0; n < this.length; n++) {
      const [c, r] = this.position(n);
      func(this[n], n, c, r);
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
    if (this._c === 0) throw Error('Columns not set!');
    return Array2d.from(this.columnMajor, this.rows);
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

  clamp(min = 0, max = 1) {
    const f = clampFunc(min, max, this.typeInterface);
    this.assign(v => f(v));
    return this;
  }

  negate() {
    const op = this.typeInterface;
    this.assign(v => op.negate(v));
    return this;
  }

  scale(factor) {
    const op = this.typeInterface;
    this.assign(v => (op.isDefined(v) ? op.multiply(v, factor) : v));
    return this;
  }

  dotProduct(other) {

  }

  sumOf(...values) {
    values = values.length === 0 ? this : values;
    const op = this.typeInterface;
    let s = op.zero();
    for (let i = 0; i < values.length; i++) {
      if (!op.isDefined(values[i])) return undefined;
      s = op.add(s, values[i]);
    }
    return s;
  }

  productOf(...values) {
    values = values.length === 0 ? this : values;
    const op = this.typeInterface;
    let p = op.unitValue();
    for (let i = 0; i < values.length; i++) {
      if (!op.isDefined(values[i])) return undefined;
      if (op.isZero(values[i])) return op.zero(); // early termination
      p = op.multiply(p, values[i]);
    }
    return p;
  }

  toArray(dim = 1, rowMajor = true) {
    const { rows, cols } = this;
    const i = rowMajor ? rows : cols;
    const j = rowMajor ? cols : rows;
    const arr = new Array(dim === 2 ? i : i * j);
    for (let ii = 0; ii < i; ii++) {
      if (dim === 2) {
        arr[ii] = new Array(j);
      }
      for (let jj = 0; jj < j; jj++) {
        const v = this.getValueAt(rowMajor ? jj : ii, rowMajor ? ii : jj);
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
    if (this._c === 0) return [1, this.length];
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

  get typeInterface() {
    return this._op || numberTypeInterface;
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
