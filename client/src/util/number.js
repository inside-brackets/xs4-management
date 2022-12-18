export const round = (num, decimalPlaces = 2) => {
  const factor = 10 ** decimalPlaces;
  return Math.round((num + Number.EPSILON) * factor) / factor;
};
