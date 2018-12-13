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

let squares = new Map;
let size = 1;
let largestTotalPower = 0;
let largestIdentifier;
while (size <= gridSize) {
  for (let row = 1; row <= gridSize - (size - 1); row++) {
    for (let col = 1; col <= gridSize - (size - 1); col++) {
      const key = `${col},${row},${size}`;
      const prevKey = `${col},${row},${size - 1}`;
      let totalPower = 0;
      if (squares.has(prevKey)) {
        totalPower = squares.get(prevKey);
        const rightCol = col + (size - 1);
        const bottomRow = row + (size - 1);
        for (let bottomCol = col; bottomCol <= rightCol; bottomCol++) {
          totalPower += cells[bottomRow][bottomCol];
        }
        for (let rightRow = row; rightRow <= row + (size - 2); rightRow++) {
          totalPower += cells[rightRow][rightCol];
        }
      } else {
        for (var i = 0; i <= size - 1; i++) {
          for (var j = 0; j <= size - 1; j++) {
            totalPower += cells[row + i][col + j];
          }
        }
      }
      squares.set(key, totalPower);
      if (totalPower >= largestTotalPower) {
        largestTotalPower = totalPower;
        largestIdentifier = key;
      }
    }
  }
  size++;
}

console.log(`X,Y,size identifier of the square with the largest total power: ${largestIdentifier} (${largestTotalPower})`);
