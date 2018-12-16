const fs = require('fs');

const file = process.argv.includes('--example') ? 'input-example-part-1.txt' : 'input.txt';

const input = fs.readFileSync(`${__dirname}/../${file}`, 'utf-8');

const lines = input.split('\n').filter(line => line.length);
const height = lines.length;
const width = Math.max(...lines.map(line => line.length));

let carts = [];
const grid = {};
for (let row = 0; row < height; row ++) {
  const line = lines[row];
  for (let col = 0; col < width; col++) {
    const value = line.charAt(col).trim() || null;
    const key = `${col},${row}`;
    grid[key] = value;
    if (['^','v','<','>'].includes(value)) {
      carts.push({
        id: carts.length,
        pos: { col, row },
        dir: value,
        intersections: 0,
        smashed: false,
      });
    }
  }
}

carts.forEach(({pos, dir}, i) => {
  const {col, row} = pos;
  const key = `${col},${row}`;
  let track;
  if (['>','<'].includes(dir)) track = '-';
  if (['^','v'].includes(dir)) track = '|';
  grid[key] = track;
});

function render() {
  let output = '';
  for (let row = 0; row < height; row ++) {
    for (let col = 0; col < width; col++) {
      let value = grid[`${col},${row}`] || ' ';
      const cart = carts.find(c => c.pos.col === col && c.pos.row === row);
      output += cart ? (cart.smashed ? 'X' : cart.dir) : value;
    }
    output += '\n';
  }
  console.log(output);
}

const output = process.argv.includes('--output');

const tickEvery = process.argv.includes('--tickEvery')
  ? +process.argv[process.argv.indexOf('--tickEvery') + 1]
  : 1;

const tick = setInterval(() => {
  carts = carts.sort((a, b) => {
    if (a.pos.row === b.pos.row) {
      if (a.pos.col === b.pos.col) return 0;
      return a.pos.col < b.pos.col ? -1 : 1;
    }
    return a.pos.row < b.pos.row ? -1 : 1;
  });
  for (var i = 0; i < carts.length; i++) {
    const cart = carts[i];
    const {col, row} = cart.pos;
    const key = `${col},${row}`;
    let nextDir = cart.dir;
    let nextKey;
    switch (cart.dir) {
      case '>':
        nextKey = `${col+1},${row}`;
        carts[i].pos.col++;
        break;
      case '<':
        nextKey = `${col-1},${row}`;
        carts[i].pos.col--;
        break;
      case 'v':
        nextKey = `${col},${row+1}`;
        carts[i].pos.row++;
        break;
      case '^':
        nextKey = `${col},${row-1}`;
        carts[i].pos.row--;
        break;
    }
    switch (grid[nextKey]) {
      case '\\':
        if (cart.dir === '>') nextDir = 'v';
        if (cart.dir === '<') nextDir = '^';
        if (cart.dir === 'v') nextDir = '>';
        if (cart.dir === '^') nextDir = '<';
        break;
      case '/':
        if (cart.dir === '>') nextDir = '^';
        if (cart.dir === '<') nextDir = 'v';
        if (cart.dir === 'v') nextDir = '<';
        if (cart.dir === '^') nextDir = '>';
        break;
      case '+':
        carts[i].intersections++;
        switch (carts[i].intersections % 3) {
          case 1:
            if (cart.dir === '>') nextDir = '^';
            if (cart.dir === '<') nextDir = 'v';
            if (cart.dir === 'v') nextDir = '>';
            if (cart.dir === '^') nextDir = '<';
            break;
          case 0:
            if (cart.dir === '>') nextDir = 'v';
            if (cart.dir === '<') nextDir = '^';
            if (cart.dir === 'v') nextDir = '<';
            if (cart.dir === '^') nextDir = '>';
            break;
        }
        break;
    }
    carts[i].dir = nextDir;
    const otherIndex = carts.findIndex(other =>
      other.id !== cart.id &&
      other.pos.col == carts[i].pos.col &&
      other.pos.row == carts[i].pos.row);
    if (output) console.clear();
    if (otherIndex !== -1) {
      carts[i].smashed = true;
      carts[otherIndex].smashed = true;
      if (output) render();
      console.log(`location of the first crash: ${carts[i].pos.col},${carts[i].pos.row}`);
      clearInterval(tick);
      return;
    }
    if (output) render();
  }
}, tickEvery * 1000);

if (output) render();
