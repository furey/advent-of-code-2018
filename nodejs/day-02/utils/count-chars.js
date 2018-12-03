module.exports = function (string) {
  const chars = {};
  for (var i = 0; i < string.length; i++) {
    const char = string[i];
    if (chars[char] !== undefined) {
      chars[char]++;
    } else {
      chars[char] = 1;
    }
  }
  return chars;
};
