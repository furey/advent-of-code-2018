module.exports = function (array, fn) {
  return array.sort((a, b) => {
    a = fn(a);
    b = fn(b);
    if (a === b) return 0;
    return a < b ? -1 : 1;
  });
};
