const fs = require('fs');
const rsortBy = require('./src/rsortBy');

const file = process.argv.includes('--example') ? 'input-example.txt' : 'input.txt';

const input = fs.readFileSync(__dirname + `/../${file}` , 'utf-8');

const gridSerialNumber = +(input.trim().match(/^(\d+)$/m)[1]);

const gridSize = 300;

const cells = {};
let rackId, powerLevel;
for (let row = 1; row <= gridSize; row++) {
  cells[row] = {};
  for (let col = 1; col <= gridSize; col++) {
    rackId = col + 10;
    powerLevel = rackId * row;
    powerLevel += gridSerialNumber;
    powerLevel *= rackId;
    powerLevel = +(powerLevel.toString().slice(-3, -2));
    powerLevel -= 5;
    cells[row][col] = powerLevel;
  }
}

let size = 1;
let largestTotalPower = 0;
let key, identifier;
while (size <= gridSize) {
  for (let row = 1; row <= gridSize - (size - 1); row++) {
    for (let col = 1; col <= gridSize - (size - 1); col++) {
      key = `${col},${row},${size}`;
      totalPower = 0;
      for (var i = 0; i <= size - 1; i++) {
        for (var j = 0; j <= size - 1; j++) {
          totalPower += cells[row+i][col+j];
        }
      }
      if (totalPower >= largestTotalPower) {
        largestTotalPower = totalPower;
        identifier = key;
      }
    }
  }
  size++;
}

console.log(`X,Y,size identifier of the square with the largest total power: ${identifier}`);
