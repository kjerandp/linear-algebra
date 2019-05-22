import expect from 'expect';
import Array2d from '../src/array-2d';

describe('Array2d class', () => {
  it('Should be able to initialize with values and retrieve values using get', () => {
    expect(new Array2d(4)).toBeInstanceOf(Array2d);

    const a = new Array2d([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = new Array2d([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);

    expect(a.getValueAt(2)).toBe(3);
    expect(a.getValueAt(3, 2)).toBeUndefined();
    expect(b.getValueAt(0, 0)).toBe(1);
    expect(b.getValueAt(1, 0)).toBe(2);
    expect(b.getValueAt(2, 0)).toBe(3);
    expect(b.getValueAt(0, 1)).toBe(4);
    expect(b.getValueAt(1, 1)).toBe(5);
    expect(b.getValueAt(2, 1)).toBe(6);
    expect(b.getValueAt(0, 2)).toBe(7);
    expect(b.getValueAt(1, 2)).toBe(8);
    expect(b.getValueAt(2, 2)).toBe(9);
    expect(b.getValueAt(7)).toBeUndefined();
    expect(a.getValueAt(10)).toBeUndefined();
    expect(b.getValueAt(1, -2)).toBeUndefined();

    const c = new Array2d([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
    ]);

    expect(c.cols).toBe(4);
    expect(c.rows).toBe(2);
  });
});
