let curDate = (new Date()).getTime();
let three = 90 * 24 * 3600 * 1000;
let threeMonths = curDate - three;

export const limitTime = () => {
  return threeMonths
};
