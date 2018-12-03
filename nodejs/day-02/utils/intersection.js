module.exports = function (a, b) {
  const intersection = {};
  for (var i = 0; i < a.length; i++) {
    const aValue = a[i];
    const bValue = b[i] || null;
    if (aValue !== bValue) continue;
    intersection[i] = bValue;
  }
  return intersection;
};
