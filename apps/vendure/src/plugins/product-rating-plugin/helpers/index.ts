export const calcAverageRating = (votes: number, ratingSum: number) => {
  if (votes === 0) {
    return 0;
  }
  const result = parseFloat(`${ratingSum / votes}`).toFixed(2);
  return Number(result);
};
