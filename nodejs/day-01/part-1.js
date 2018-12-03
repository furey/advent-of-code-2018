const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf-8');

const changes = input
  .split('\n')
  .filter(change => change.length)
  .map(change => {
    const operator = change[0];
    const value = change.slice(1) * 1;
    return { operator, value };
  });

const operations = {
  '+': (x, y) => x + y,
  '-': (x, y) => x - y,
};

const frequency = changes.reduce((carry, {operator, value}) => operations[operator](carry, value), 0);

console.log(`frequency: ${frequency}`);
