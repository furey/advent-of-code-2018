const fs = require('fs');
const difference = require('./src/difference');
const intersection = require('./src/intersection');

const input = fs.readFileSync(__dirname + '/../input.txt', 'utf-8');

const ids = input
  .split('\n')
  .filter(id => id.length);

const list = ids.map(id => ({
  id,
  chars: id.split(''),
}));

const prototypes = list.reduce((carry, item) => {
  const {id, chars} = item;
  for (var i = 0; i < list.length; i++) {
    const {id: otherId, chars: otherChars} = list[i];
    if (id === otherId) continue;
    const diff = difference(chars, otherChars);
    if (Object.entries(diff).length !== 1) continue;
    carry.push(item)
  }
  return carry;
}, []);

const commonLetters = Object.values(prototypes.reduce((carry, item) => {
  if (!carry) return item;
  return intersection(carry.chars, item.chars);
})).join('');

console.log(`common letters: ${commonLetters}`);
