module.exports = function (a, b) {
  const difference = {};
  for (var i = 0; i < a.length; i++) {
    const aValue = a[i];
    const bValue = b[i] || null;
    if (aValue === bValue) continue;
    difference[i] = bValue;
  }
  return difference;
};
