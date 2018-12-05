module.exports = function (polymer) {
  let units = polymer.split('');
  let index = 0;
  while (true) {
    if (index === units.length - 1) break;
    a = units[index];
    b = units[index + 1];
    if (a.toUpperCase() === b.toUpperCase() && a !== b) {
      units.splice(index, 2);
      index = Math.max(0, index - 1);
      continue;
    }
    index++;
  }
  return units.join('');
};
