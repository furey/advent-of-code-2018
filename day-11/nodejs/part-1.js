const fs = require('fs');

const file = process.argv.includes('--example') ? 'input-example.txt' : 'input.txt';

const input = fs.readFileSync(__dirname + `/../${file}` , 'utf-8');

const gridSerialNumber = +(input.trim().match(/^(\d+)$/m)[1]);

const gridSize = 300;

const cells = {};
for (let row = 1; row <= gridSize; row++) {
  cells[row] = {};
  for (let col = 1; col <= gridSize; col++) {
    const rackId = col + 10;
    let powerLevel = rackId * row;
    powerLevel += gridSerialNumber;
    powerLevel *= rackId;
    powerLevel = +(powerLevel.toString().slice(-3, -2));
    powerLevel -= 5;
    cells[row][col] = powerLevel;
  }
}

let size = 3;
let largestTotalPower = 0;
let largestIdentifier;
for (let row = 1; row <= gridSize - (size - 1); row++) {
  for (let col = 1; col <= gridSize - (size - 1); col++) {
    const key = `${col},${row}`;
    let totalPower = 0;
    for (var i = 0; i <= size - 1; i++) {
      for (var j = 0; j <= size - 1; j++) {
        totalPower += cells[row + i][col + j];
      }
    }
    if (totalPower >= largestTotalPower) {
      largestTotalPower = totalPower;
      largestIdentifier = key;
    }
  }
}

console.log(`X,Y coordinate with the largest total power: ${largestIdentifier} (${largestTotalPower})`);
