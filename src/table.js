import { clampValue } from './internal';

class Table extends Array {
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

    super(values.length);
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

    if (this.length > values.length) {
      this.splice(values.length);
    }
    for (let i = 0; i < values.length; i++)
      this[i] = values[i];
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

  get(c = 0, r = 0) {
    return this[this.index(c, r)];
  }

  set(...args) {
    const [c, r, v] = args;
    if (c.length) {
      this._set(args);
    } else {
      this[this.index(c, r)] = v;
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
      if (other.length) {
        for (let i = 0; i < other.length; i++) {
          this[i] += other[i];
        }
      }
    });
    return this;
  }

  get value() {
    return Array.from(this);
  }

  set value(arg) {
    this._set(arg);
  }

  get valueColumnMajor() {
    const arr = new Array(this.length);
    for (let n = 0; n < this.length; n++) {
      const [c, r] = this.position(n);
      arr[this.rows * c + r] = this[n];
    }
    return arr;
  }

  get cols() {
    return this._columns;
  }

  get rows() {
    return Math.ceil(this.length / this.cols);
  }

  toFloat32() {
    const f32arr = new Float32Array(this);
    if (!f32arr.length || Number.isNaN(f32arr[0]))
      throw Error('Only supported for numeric values');
    return f32arr;
  }
}

export default Table;

