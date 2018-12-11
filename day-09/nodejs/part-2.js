const fs = require('fs');
const Node = require('./src/node');

const file = process.argv.includes('--example') ? 'input-example.txt' : 'input.txt';

const input = fs.readFileSync(__dirname + `/../${file}` , 'utf-8');

const matches = input.match(/^(\d+) players; last marble is worth (\d+) points/m);

const totalPlayers = matches[1] * 1;
const lastMarbleWorth = matches[2] * 1 * 100;

const playerScores = Array.from({ length: totalPlayers }, playerScore => 0);

let marbleValue = 0;
let marble = new Node(0);

while (marbleValue < lastMarbleWorth) {
  marbleValue++;
  const currentPlayerIndex = (marbleValue - 1) % totalPlayers;
  if (marbleValue % 23 === 0) {
    playerScores[currentPlayerIndex] += marbleValue;
    let toRemove = marble.getPrev(7);
    marble = toRemove.next;
    let removed = toRemove.remove();
    playerScores[currentPlayerIndex] += removed.data;
  } else {
    const next = new Node(marbleValue);
    marble.next.addNext(next);
    marble = next;
  }
}

const winningScore = Math.max(...playerScores);

console.log(`winning elf's score: ${winningScore}`);
