const fs = require('fs');
const react = require('./src/react');
const sortBy = require('./src/sortBy');

const polymer = fs.readFileSync(__dirname + '/../input.txt', 'utf-8').trim();

const results = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(type => {
  const typeless = polymer.replace(new RegExp(type, 'ig'), '');
  return {
    type,
    length: react(typeless).length,
  };
});

const shortest = sortBy(results, result => result.length)[0];

console.log(`length of the shortest polymer ('${shortest.type}'): ${shortest.length}`);


