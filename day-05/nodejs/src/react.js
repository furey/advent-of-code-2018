module.exports = function (polymer) {
  let index = 0, a, b;
  while (true) {
    if (index === polymer.length - 1) break;
    a = polymer[index];
    b = polymer[index + 1];
    if (a.toUpperCase() === b.toUpperCase() && a !== b) {
      polymer = polymer.slice(0, index) + polymer.slice(index + 2);
      index = Math.max(0, index - 1);
      continue;
    }
    index++;
  }
  return polymer;
};
