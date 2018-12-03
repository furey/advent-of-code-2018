const fs = require('fs');

const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');

const ids = input
  .split('\n')
  .filter(id => id.length);

function countChars(string) {
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
}

const counts = ids.map(id => {
  return Object.entries(countChars(id))
    .filter(([, count]) => count >= 2);
});

const sums = counts.reduce((carry, counts) => {
  if (counts.some(([, count]) => count === 2)) carry['2']++;
  if (counts.some(([, count]) => count === 3)) carry['3']++;
  return carry;
}, {
  '2': 0,
  '3': 0,
});

const checksum = Object.entries(sums)
  .reduce((carry, [, sum]) => carry * sum, 1);

console.log(`checksum: ${checksum}`);
