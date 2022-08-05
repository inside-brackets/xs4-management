export const round = (num, decimalPlaces) => {
  const factor = 10 ** decimalPlaces;
  return Math.round((num + Number.EPSILON) * factor) / factor;
};
