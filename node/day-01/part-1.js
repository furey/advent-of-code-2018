const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf-8');

const changes = input.split('\n').filter(change => change.length);

const operations = {
  '+': (x, y) => x + y,
  '-': (x, y) => x - y,
};

let frequency = changes.reduce((carry, change) => {
  const operator = change[0];
  const value = change.slice(1) * 1;
  return operations[operator](carry, value);
}, 0);

console.log(`frequency: ${frequency}`);
