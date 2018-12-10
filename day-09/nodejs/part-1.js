const fs = require('fs');
const rsortBy = require('./src/rsortBy');

const file = process.argv.includes('--example') ? 'input-example.txt' : 'input.txt';

const input = fs.readFileSync(__dirname + `/../${file}` , 'utf-8');

const matches = input.match(/^(\d+) players; last marble is worth (\d+) points/m);

const totalPlayers = matches[1] * 1;
const lastMarbleWorth = matches[2] * 1;

const players = Array.apply({ marbles: [] }, Array(totalPlayers))
  .reduce((carry, ignore, i) => {
    const id = i + 1;
    carry[id] = {
      id,
      marbles: [],
    };
    return carry;
  }, {})

const marbles = Array.apply(null, Array(lastMarbleWorth))
  .reduce((carry, ignore, i) => {
    carry.push(i+1);
    return carry;
  }, []).reverse();

const circle = [0];

let currentPlayerId = 1;
let currentMarbleIndex = 0;

// console.log('[-] 0');
while (marbles.length) {
  const player = players[currentPlayerId];
  const marble = marbles.pop();
  let maxCircleIndex = circle.length - 1;
  let insertionIndex;
  // However, if the marble that is about to be placed has a number which is a multiple of 23, something entirely different happens.
  let style = '\x1b[32m';
  if (marble % 23 === 0) {
    // First, the current player keeps the marble they would have placed, adding it to their score.
    players[currentPlayerId].marbles.push(marble);
    // In addition, the marble 7 marbles counter-clockwise from the current marble is removed from the circle 
    insertionIndex = currentMarbleIndex - 7;
    if (insertionIndex < 0) insertionIndex = maxCircleIndex + 1 + insertionIndex;
    const removed = circle.splice(insertionIndex, 1)[0];
    // and also added to the current player's score. 
    players[currentPlayerId].marbles.push(removed);
    // The marble located immediately clockwise of the marble that was removed becomes the new current marble.
    maxCircleIndex = circle.length - 1;
    if (insertionIndex > maxCircleIndex + 1) insertionIndex = 1;
    style = '\x1b[31m';
  } else {
    insertionIndex = currentMarbleIndex + 2;
    if (insertionIndex > maxCircleIndex + 1) insertionIndex = 1;
    circle.splice(insertionIndex, 0, marble);
  }
  currentMarbleIndex = insertionIndex;
  // console.log(`[${currentPlayerId}] ${circle.map(m => {
  //   if (m === circle[currentMarbleIndex]) return style + m + '\x1b[0m';
  //   return m;
  // }).join(',')}`);
  if (currentPlayerId === totalPlayers) {
    currentPlayerId = 1;
  } else {
    currentPlayerId++;
  }
}

const winningScore = rsortBy(Object.entries(players).map(([, player]) => {
  player.score = player.marbles.reduce((carry, score) => carry + score, 0);
  return player;
}), player => player.score)[0].score;

console.log(`winning elf's score: ${winningScore}`);
