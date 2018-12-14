/* eslint-disable no-console */
const fs = require('fs');

const file = process.argv.includes('--example') ? 'input-example.txt' : 'input.txt';

const input = fs.readFileSync(`${__dirname}/../${file}`, 'utf-8');

const initialState = input.match(/initial state: (.*)$/m)[1];

const rules = input.match(/^[.#]{5} => [.#]$/gm).reduce((carry, line) => {
  const [, rule, value] = line.match(/^([.#]{5}) => ([.#])$/);
  carry[rule] = value;
  return carry;
}, {});

let pots = Object.assign({}, initialState.split(''));
let firstPotWithPlant = initialState.indexOf("#");
let lastPotWithPlant = initialState.lastIndexOf("#");
const generations = [initialState];
for (let g = 1; g <= 20; g++) {
  let newPots = {};
  for (let i = 4; i > 0; i--) pots[firstPotWithPlant - i] = '.';
  for (let i = 1; i <= 4; i++) pots[lastPotWithPlant + i] = '.';
  let lastPot = lastPotWithPlant + 2;
  for (let i = firstPotWithPlant - 2; i <= lastPot; i++) {
    const state = pots[i - 2] + pots[i - 1] + pots[i] + pots[i + 1] + pots[i + 2];
    let newState = rules[state] || '.';
    newPots[i] = newState;
    if (newState === "#" && firstPotWithPlant > i) firstPotWithPlant = i;
    if (newState === "." && firstPotWithPlant === i) firstPotWithPlant++;
    if (newState === "#" && lastPotWithPlant < i) lastPotWithPlant = i;
    if (newState === "." && lastPotWithPlant === i) {
      for (let j = i;; j--) {
        if (newPots[j] === "#") {
          lastPotWithPlant = j;
          break;
        }
      }
    }
  }
  pots = newPots;
  const generation = Object.entries(pots)
    .sort(([a], [b]) => { if (a === b) return a; return a < b ? -1 : 1; })
    .map(([, v]) => v)
    .join('');
  generations.push(generation);
}

const sum = Object.entries(pots)
  .map(([number, value]) => ({ number, value }))
  .filter(({value}) => value === '#')
  .reduce((carry, {number}) => carry + (+number), 0);

console.log(`the sum of the numbers of all pots which contain a plant: ${sum}`);
