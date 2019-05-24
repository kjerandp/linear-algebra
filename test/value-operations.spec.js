import expect from 'expect';
import op from '../src/value-operations';

describe('Value operations', () => {
  it('Should be able to do basic arithmetic operations', () => {
    expect(op.product([1, 2, 3])).toBe(6);
    expect(op.product([1, 2, 3, 4, 5, 6, 7, 8])).toBe(40320);
    expect(op.clamp(-1, 0, 1)).toBe(0);
    expect(op.clamp(2, 0, 1)).toBe(1);
    expect(op.clamp(2, 0, 3)).toBe(2);
    expect(op.sum([1, 2, 3])).toBe(6);
    expect(op.sum([1, 2, 3, 4, 5, 6, 7, 8])).toBe(36);
    expect(op.sum()).toBe(0);
  });
});
