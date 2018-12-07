const fs = require('fs');
const last = require('./src/last');
const sortBy = require('./src/sortBy');
const styles = require('./src/styles');
const distance = require('./src/distance');

let input = fs.readFileSync(__dirname + '/../input.txt', 'utf-8');

let points = input
  .trim()
  .split('\n')
  .reduce((carry, point, i) => {
    const [x, y] = point.split(', ').map(n => Number(n));
    const key = `${x},${y}`;
    const code = String.fromCharCode(65 + i);
    const area = 1;
    carry[key] = { x, y, code, area };
    return carry;
  }, {});

const entries = Object.entries(points);
const byX = sortBy(entries.slice(0), ([, p]) => p.x);
const byY = sortBy(entries.slice(0), ([, p]) => p.y);
const bounds = {
  x: [byX[0][1].x, last(byX)[1].x],
  y: [byY[0][1].y, last(byY)[1].y],
};

let output = '';
let size = 0;
for (let row = bounds.y[0]; row <= bounds.y[1]; row++) {
  for (let col = bounds.x[0]; col <= bounds.x[1]; col++) {
    let key = `${col},${row}`;
    const pos = { x: col, y: row };
    let rendered = false;
    if (points[key] !== undefined) {
      output += styles.green + points[key].code + styles.reset;
      rendered = true;
    }
    const distanceSum = entries.slice(0).reduce((carry, [k, p]) => carry + distance(pos, p), 0);
    let value;
    let style = styles.dim;
    if (distanceSum < 10000) {
      value = '#';
      style = styles.red;
      size++;
    } else {
      value = '.';
    }
    if (!rendered) output += style + value + styles.reset;
  }
  output += '\n';
}

if (process.argv.includes('--output')) console.log(output);

console.log(`size of the region: ${size}`);
