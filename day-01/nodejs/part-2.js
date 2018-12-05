const {changes, operations} = require(__dirname + '/src/shared');

let frequency = 0;
const frequencies = {};
let firstFrequencyReachedTwice = null;

while (firstFrequencyReachedTwice === null) {
  for (var i = 0; i < changes.length; i++) {
    const {operator, value} = changes[i];
    frequency = operations[operator](frequency, value);
    if (frequencies[frequency] !== undefined) {
      firstFrequencyReachedTwice = frequency;
      break;
    }
    frequencies[frequency] = true;
  }
}

console.log(`first frequency reached twice: ${firstFrequencyReachedTwice}`);
