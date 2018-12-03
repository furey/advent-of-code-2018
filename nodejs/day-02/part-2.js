const fs = require('fs');

const input = fs.readFileSync(__dirname + '/input.txt', 'utf-8');

const ids = input
  .split('\n')
  .filter(id => id.length);

const list = ids.map(id => ({
  id,
  chars: id.split(''),
}));

function difference(a1, a2)
{
  const diff = {};
  for (var i = 0; i < a1.length; i++) {
    const a1value = a1[i];
    const a2value = a2[i] || null;
    if (a1value === a2value) continue;
    diff[i] = a2value;
  }
  return diff;
}

function intersection(a1, a2)
{
  const same = {};
  for (var i = 0; i < a1.length; i++) {
    const a1value = a1[i];
    const a2value = a2[i] || null;
    if (a1value !== a2value) continue;
    same[i] = a2value;
  }
  return same;
}

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
