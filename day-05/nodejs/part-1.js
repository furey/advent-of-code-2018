const fs = require('fs');
const react = require('./src/react');

const polymer = fs.readFileSync(__dirname + '/../input.txt', 'utf-8').trim();

const unitsRemaining = react(polymer).length;

console.log(`units remaining: ${unitsRemaining}`);


