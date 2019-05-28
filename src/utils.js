
export function argumentsToList(arg = [], rec = true, values = []) {
  if (arg._values) {
    arg = arg._values;
  }

  if (rec && Array.isArray(arg)) {
    arg.forEach((v) => {
      if (v._values || Array.isArray(v)) {
        argumentsToList(v, rec, values);
      } else {
        values.push(v);
      }
    });
  } else {
    values.push(arg);
  }
  return values;
}

export function range(size, start = 0, step = 1) {
  const arr = new Array(size);
  for (let i = 0; i < size; i++) {
    arr[i] = start + (i * step);
  }
  return arr;
}

export function constantIterator(value, times = Infinity) {
  let i = 0;
  const res = {
    value: undefined,
    done: false,
  };
  return {
    next: () => {
      if (i >= times) {
        res.done = true;
        res.value = undefined;
      } else {
        res.value = value;
      }
      i++;
      return res;
    },
  };
}

function array2dIterator(arr) {
  let r = 0;
  let c = 0;
  const last = arr.length - 1;
  const res = {
    value: undefined,
    done: false,
  };
  return {
    next: () => {
      if (r > last) {
        res.done = true;
        res.value = undefined;
      } else {
        res.value = arr[r][c];
        c++;
        if (c >= arr[r].length) {
          r++;
          c = 0;
        }
      }
      return res;
    },
  };
}

export function arrayIterator(arr) {
  if (arr[0] && Array.isArray(arr[0])) return array2dIterator(arr);
  let i = 0;
  const res = {
    value: undefined,
    done: false,
  };
  return {
    next: () => {
      if (i >= arr.length) {
        res.done = true;
        res.value = undefined;
      } else {
        res.value = arr[i];
      }
      i++;
      return res;
    },
  };
}

export function combinedIterator(...iterators) {
  const value = new Array(iterators.length);
  let done = false;
  const iterate = () => {
    for (let i = 0; i < iterators.length; i++) {
      const _c = iterators[i].next();
      if (_c.done) {
        done = true;
        break;
      }
      value[i] = _c.value;
    }
    return {
      value,
      done,
    };
  };
  return {
    next: iterate,
  };
}
