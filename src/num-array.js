class NumArray extends Array {
  constructor(values = [], columns = 0) {
    super(values.length);
    this._columns = columns;
    this._set(values);
  }

  _index(i, j = 0) {
    if (this._columns <= 0) return i - 1;
    if (j <= 0) return undefined;
    return (i - 1) * this._columns + (j - 1);
  }

  _set(arg) {
    let values;
    if (Array.isArray(arg)) {
      values = arg.reduce((arr, v) => {
        if (Array.isArray(v)) {
          arr.push(...v);
          return arr;
        }
        arr.push(v);
        return arr;
      }, []);
    } else {
      values = [arg];
    }

    if (this.length > values.length) {
      this.splice(values.length);
    }
    for (let i = 0; i < values.length; i++)
      this[i] = values[i];
  }

  position(idx) {
    if (this._columns === 0)
      return [idx + 1, 1];

    const i = ~~(idx / this._columns) + 1;
    const j = (idx % this._columns) + 1;

    return [i, j];
  }

  get(i, j = 0) {
    if (this._columns <= 0 && j > 0) return undefined;
    return this[this._index(i, j)];
  }

  set(...args) {
    this._set(args);
    return this;
  }

  cell(i, j) {
    const _t = this;
    return ({
      set value(v) {
        _t[_t._index(i, j)] = v;
      },
      get value() {
        return _t.get(i, j);
      },
    });
  }

  assign(func) {
    for (let n = 0; n < this.length; n++) {
      const [i, j] = this.position(n);
      this[n] = func(this[n], i, j, n);
    }
    return this;
  }

  get value() {
    return Array.from(this);
  }

  set value(arg) {
    this._set(arg);
  }

  toFloat32() {
    return new Float32Array(this);
  }
}

export default NumArray;

