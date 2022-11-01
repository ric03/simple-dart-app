export function calculateRemainingPoints(throws) {
  const accumulatedPoints = throws
    .flat()
    .reduce((acc, curr) => acc + curr.value * curr.multiplier, 0);
  return 501 - accumulatedPoints;
}
