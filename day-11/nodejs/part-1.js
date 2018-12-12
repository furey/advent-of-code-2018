const fs = require('fs');
const rsortBy = require('./src/rsortBy');

const file = process.argv.includes('--example') ? 'input-example.txt' : 'input.txt';

const input = fs.readFileSync(__dirname + `/../${file}` , 'utf-8');

const gridSerialNumber = +(input.trim().match(/^(\d+)$/m)[1]);

const rows = 300;
const cols = 300;

const cells = {};
let rackId, powerLevel;
for (let row = 1; row <= rows; row++) {
  cells[row] = {};
  for (let col = 1; col <= cols; col++) {
    rackId = col + 10;
    powerLevel = rackId * row;
    powerLevel += gridSerialNumber;
    powerLevel *= rackId;
    powerLevel = +(powerLevel.toString().slice(-3, -2));
    powerLevel -= 5;
    cells[row][col] = powerLevel;
  }
}

const squares = {};
let key;
for (let row = 1; row <= rows - 2; row++) {
  for (let col = 1; col <= cols - 2; col++) {
    key = `${col},${row}`;
    squares[key] =
      cells[row+0][col+0] + cells[row+0][col+1] + cells[row+0][col+2] + 
      cells[row+1][col+0] + cells[row+1][col+1] + cells[row+1][col+2] + 
      cells[row+2][col+0] + cells[row+2][col+1] + cells[row+2][col+2];
  }
}

const [coordinate] = rsortBy(Object.entries(squares).sort(), ([, totalPower]) => totalPower)[0];

console.log(`X,Y coordinate of the top-left fuel cell of the 3x3 square with the largest total power: ${coordinate}`);
