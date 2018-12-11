const fs = require('fs');

const file = process.argv.includes('--example') ? 'input-example.txt' : 'input.txt';

const input = fs.readFileSync(__dirname + `/../../${file}` , 'utf-8');

let points = input
  .trim()
  .split('\n')
  .map(line => {
    const matches = line.match(/^position=<([ -]*\d+), ([ -]*\d+)\> velocity=<([ -]*\d+), ([ -]*\d+)>$/);
    return {
      pos: { x: +matches[1], y: +matches[2] },
      vel: { x: +matches[3], y: +matches[4] },
    }
  });

function tick() {
  points = points.map(p => {
    p.pos.x += p.vel.x;
    p.pos.y += p.vel.y;
    return p;
  });
  const x = points.map(p => p.pos.x);
  const y = points.map(p => p.pos.y);
  const bounds = {
    x: [Math.min(...x), Math.max(...x)],
    y: [Math.min(...y), Math.max(...y)],
  }
  const width = Math.abs(bounds.x[1] - bounds.x[0]);
  return {points, bounds, width};
}

let second = 0;
let bounds = undefined;
let width = Infinity;
let output = '';

while (true) {
  const next = tick();
  if (next.width < width) {
      points = next.points;
      bounds = next.bounds;
      width = next.width;
      second++;
      continue;
  }
  const o = points.map(p => {
    p.pos.x -= p.vel.x;
    p.pos.y -= p.vel.y;
    return p;
  }).reduce((carry, point) => {
    let { x, y } = point.pos;
    const key = `${x},${y}`;
    carry[key] = true;
    return carry;
  }, {});
  for (let row = bounds.y[0]; row <= bounds.y[1]; row++) {
    for (let col = bounds.x[0]; col <= bounds.x[1]; col++) {
      const key = `${col},${row}`;
      const pos = { x: col, y: row };
      output += o[key] !== undefined ? '#' : '.';
    }
    output += '\n';
  }
  break;
}

module.exports = {
  output,
  seconds: second,
};
