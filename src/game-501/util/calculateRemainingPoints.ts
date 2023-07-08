import { Throw } from '../types/throw.ts';

export function calculateSumOfThrows(throws: Throw[][]) {
  return throws
    .flat()
    .reduce((acc, curr) => acc + curr.value * curr.multiplier, 0);
}

export function calculateRemainingPoints(throws: Throw[][]) {
  const accumulatedPoints = calculateSumOfThrows(throws);
  return 501 - accumulatedPoints;
}
