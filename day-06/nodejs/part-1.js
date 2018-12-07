const fs = require('fs');
const last = require('./src/last');
const sortBy = require('./src/sortBy');
const rsortBy = require('./src/rsortBy');
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
const topLeft = { x: byX[0][1].x, y: byY[0][1].y };
const bottomRight = { x: last(byX)[1].x, y: last(byY)[1].y };
const xEdges = [topLeft.x, bottomRight.x];
const yEdges = [topLeft.y, bottomRight.y];

const style = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
};

let output = '';
for (let row = topLeft.y; row <= bottomRight.y; row++) {
  for (let col = topLeft.x; col <= bottomRight.x; col++) {
    let key = `${col},${row}`;
    const pos = { x: col, y: row };
    if (points[key] !== undefined) {
      output += style.green + points[key].code + style.reset;
      continue;
    }
    const distances = entries.reduce((carry, [k, p]) => {
      carry[k] = distance(pos, p);
      return carry;
    }, {});
    const closest = sortBy(Object.entries(distances), ([, d]) => d);
    let value;
    let s = style.dim;
    if (closest[0][1] === closest[1][1]) {
      value = '.';
    } else {
      key = closest[0][0];
      value = points[key].code.toLowerCase();
      points[key].area++;
    }
    if (xEdges.includes(pos.x) || yEdges.includes(pos.y)) {
      s = style.red;
      if (points[key] !== undefined) points[key].infinite = true;
    }
    output += s + value + style.reset;
  }
  output += '\n';
}

const [, largest] = rsortBy(
  Object.entries(points).filter(([, p]) => p.infinite === undefined),
  ([, p]) => p.area
)[0];

if (process.argv.includes('--output')) console.log(output);

console.log(`size of the largest finite area ('${largest.x},${largest.y}' aka '${largest.code}'): ${largest.area}`);
