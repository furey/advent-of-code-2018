const fs = require('fs');

const input = fs.readFileSync(__dirname + '/../../input.txt', 'utf-8')
    .split('\n')
    .filter(s => s.length);

const claims = {};

input.forEach(claim => {
    const matches = claim.split(/^#(\d+)\s@\s(\d+),(\d+):\s(\d+)x(\d+)/i).filter(s => s.length);
    const id = Number(matches[0]);
    claims[id] = {
        id,
        x: Number(matches[1]),
        y: Number(matches[2]),
        w: Number(matches[3]),
        h: Number(matches[4]),
    };
});

const fabric = {};

Object.entries(claims).forEach(([, claim]) => {
  for (let y = claim['y']; y < claim['y'] + claim['h']; y++) {
    for (let x = claim['x']; x < claim['x'] + claim['w']; x++) {
      const pos = `${x},${y}`;
      if (fabric[pos] === undefined) fabric[pos] = [];
      fabric[pos].push(claim['id']);
      if (fabric[pos].length < 2) continue;
      fabric[pos].forEach(id => {
        claims[id].overlaps = true;
      });
    }
  }
});

module.exports = {
    claims,
    fabric,
};
