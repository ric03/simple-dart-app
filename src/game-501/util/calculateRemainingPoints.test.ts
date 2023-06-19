import { describe, expect, it } from 'vitest';
import { calculateRemainingPoints } from './calculateRemainingPoints.ts';
import { Throw } from '../types/throw.ts';

describe('calculateRemainingPoints', () => {
  it('should work with a combination of nested arrays', () => {
    const SINGLE: Throw = { value: 1, multiplier: 1 };
    const input: Throw[][] = [
      [SINGLE, SINGLE, SINGLE],
      [SINGLE, SINGLE],
      [SINGLE],
      [],
    ];
    const result = calculateRemainingPoints(input);
    expect(result).eq(501 - 6);
  });

  it('should work with multiplier 1, 2 and 3', () => {
    const SINGLE: Throw = { value: 20, multiplier: 1 };
    const DOUBLE: Throw = { value: 20, multiplier: 2 };
    const TRIPLE: Throw = { value: 20, multiplier: 3 };

    const input: Throw[][] = [[SINGLE, DOUBLE, TRIPLE]];

    const result = calculateRemainingPoints(input);
    expect(result).eq(501 - 120);
  });

  it('should return 0 given throws accumulating to 501 points', () => {
    const POINTS_21: Throw = { value: 7, multiplier: 3 };
    const POINTS_60: Throw = { value: 20, multiplier: 3 };
    const input: Throw[][] = [
      [POINTS_60, POINTS_60, POINTS_60],
      [POINTS_60, POINTS_60, POINTS_60],
      [POINTS_60, POINTS_60, POINTS_21],
    ];

    const result = calculateRemainingPoints(input);
    expect(result).eq(0);
  });
});
