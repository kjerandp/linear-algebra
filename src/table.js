import { clampValue } from './internal';

class Table {
  constructor(arg0, arg1) {
    let columns = null, values = [];
    if (arg0 !== undefined && arg0.length) {
      values = arg0;
      columns = values.length;
      if (arg0.length > 0 && arg0[0].length) {
        columns = arg0[0].length;
      }
    } else if (arg0 > 0) {
      columns = arg0;
      values = arg1 === undefined ? [] : arg1;
    }

    if (columns < 1) throw Error('Invalid arguments!');

    this._values = [];
    this._columns = columns;
    this._set(values);
  }

  _set(arg) {
    let values;
    if (arg.reduce) {
      values = arg.reduce((arr, v) => {
        if (Array.isArray(v)) {
          arr.push(...v);
          return arr;
        }
        arr.push(v);
        return arr;
      }, []);
    } else if (arg.length) {
      values = arg;
    } else {
      values = [arg];
    }

    if (this._values.length > values.length) {
      this._values.splice(values.length);
    }
    for (let i = 0; i < values.length; i++)
      this._values[i] = values[i];
  }

  index(c = 0, r = 0) {
    if (r >= this.rows || c >= this.cols) return undefined;
    return r * this._columns + c;
  }

  position(idx) {
    if (this._columns > idx)
      return [idx, 0];

    const r = ~~(idx / this._columns);
    const c = (idx % this._columns);

    return [c, r];
  }

  getCellValue(c = 0, r = 0) {
    return this._values[this.index(c, r)];
  }

  setCellValue(...args) {
    const [c, r, v] = args;
    if (c.length) {
      this._set(args);
    } else {
      this._values[this.index(c, r)] = v;
    }
    return this;
  }

  assign(func) {
    for (let n = 0; n < this._values.length; n++) {
      const [c, r] = this.position(n);
      this._values[n] = func(this._values[n], c, r, n);
    }
    return this;
  }

  clamp(min = 0, max = 1) {
    this.assign(v => clampValue(v, min, max));
    return this;
  }

  negate() {
    this.assign(v => -v);
    return this;
  }

  add(...others) {
    others.forEach((other) => {
      if (other.value) {
        other = other.value;
      }
      if (other.length) {
        for (let i = 0; i < other.length; i++) {
          this._values[i] += other[i];
        }
      }
    });
    return this;
  }

  get value() {
    return this._values;
  }

  set value(arg) {
    this._set(arg);
  }

  get valueColumnMajor() {
    const arr = new Array(this._values.length);
    for (let n = 0; n < this._values.length; n++) {
      const [c, r] = this.position(n);
      arr[this.rows * c + r] = this._values[n];
    }
    return arr;
  }

  get cols() {
    return this._columns;
  }

  set cols(n) {
    this._columns = n;
    return this;
  }

  get rows() {
    return Math.ceil(this._values.length / this.cols);
  }

  get entries() {
    return this._values.length;
  }

  toFloat32() {
    const f32arr = new Float32Array(this._values);
    if (!f32arr.length || Number.isNaN(f32arr[0]))
      throw Error('Only supported for numeric values');
    return f32arr;
  }
}

export default Table;

