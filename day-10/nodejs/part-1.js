const fs = require('fs');

const file = process.argv.includes('--example') ? 'input-example.txt' : 'input.txt';

const input = fs.readFileSync(__dirname + `/../${file}` , 'utf-8');

let points = input
  .trim()
  .split('\n')
  .map(line => {
    const matches = line.match(/^position=<([ -]*\d+), ([ -]*\d+)\> velocity=<([ -]*\d+), ([ -]*\d+)>$/);
    return {
      pos: {
        x: matches[1] * 1,
        y: matches[2] * 1,
      },
      vel: {
        x: matches[3] * 1,
        y: matches[4] * 1,
      }
    }
    return matches;
  });

function step(points) {
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
  return { points, bounds, width };
}

async function tick() {
  let second = 0;
  let bounds, width;
  while (true) {
    const nextPoints = points.slice(0).map(p => {
      p.pos.x += p.vel.x;
      p.pos.y += p.vel.y;
      return p;
    });
    const x = nextPoints.map(p => p.pos.x);
    const y = nextPoints.map(p => p.pos.y);
    const nextBounds = {
      x: [Math.min(...x), Math.max(...x)],
      y: [Math.min(...y), Math.max(...y)],
    }
    const nextWidth = Math.abs(nextBounds.x[1] - nextBounds.x[0]);
    if (nextWidth >= width) {
      let output = '';
      const o = points.map(p => {
        p.pos.x -= p.vel.x;
        p.pos.y -= p.vel.y;
        return p;
      }).reduce((carry, point) => {
        let {x, y} = point.pos;
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
      console.log(output);
      break;
    }
    points = nextPoints;
    bounds = nextBounds;
    width = nextWidth;
    second++;
  }
}

tick();
