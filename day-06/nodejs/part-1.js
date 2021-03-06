const fs = require('fs');
const last = require('./src/last');
const sortBy = require('./src/sortBy');
const styles = require('./src/styles');
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
const bounds = {
  x: [byX[0][1].x, last(byX)[1].x],
  y: [byY[0][1].y, last(byY)[1].y],
};

let output = '';
for (let row = bounds.y[0]; row <= bounds.y[1]; row++) {
  for (let col = bounds.x[0]; col <= bounds.x[1]; col++) {
    let key = `${col},${row}`;
    const pos = { x: col, y: row };
    if (points[key] !== undefined) {
      output += styles.green + points[key].code + styles.reset;
      continue;
    }
    const distances = entries.reduce((carry, [k, p]) => {
      carry[k] = distance(pos, p);
      return carry;
    }, {});
    const closest = sortBy(Object.entries(distances), ([, d]) => d);
    let value;
    let style = styles.dim;
    if (closest[0][1] === closest[1][1]) {
      value = '.';
    } else {
      key = closest[0][0];
      value = points[key].code.toLowerCase();
      points[key].area++;
    }
    if (bounds.x.includes(pos.x) || bounds.y.includes(pos.y)) {
      style = styles.red;
      if (points[key] !== undefined) points[key].infinite = true;
    }
    output += style + value + styles.reset;
  }
  output += '\n';
}

const [, largest] = rsortBy(
  Object.entries(points).filter(([, p]) => p.infinite === undefined),
  ([, p]) => p.area
)[0];

if (process.argv.includes('--output')) console.log(output);

console.log(`size of the largest finite area ('${largest.x},${largest.y}' aka '${largest.code}'): ${largest.area}`);
