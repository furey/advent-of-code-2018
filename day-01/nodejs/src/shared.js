const fs = require('fs');

const input = fs.readFileSync(__dirname + '/../../input.txt', 'utf-8');

const changes = input
  .split('\n')
  .filter(change => change.length)
  .map(change => {
    const operator = change[0];
    const value = change.slice(1) * 1;
    return { operator, value };
  });

const operations = {
  '+': (x, y) => x + y,
  '-': (x, y) => x - y,
};

module.exports = {
    changes,
    operations,
};
