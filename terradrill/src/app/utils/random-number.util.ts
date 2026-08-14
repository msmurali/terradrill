export const randomNumberGenerator = (start: number, end: number) => {
  const rand = Math.random();
  return Math.floor(rand * (end - start + 1)) + start;
};
