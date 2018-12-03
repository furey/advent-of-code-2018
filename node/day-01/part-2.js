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

let frequency = 0;
let frequencies = [];
let firstFrequencyReachedTwice = null;

while (firstFrequencyReachedTwice === null) {
  for (var i = 0; i < changes.length; i++) {
    const {operator, value} = changes[i];
    frequency = operations[operator](frequency, value);
    if (frequencies.includes(frequency)) {
      firstFrequencyReachedTwice = frequency;
      break;
    }
    frequencies.push(frequency);
  }
}

console.log(`first frequency reached twice: ${firstFrequencyReachedTwice}`);
