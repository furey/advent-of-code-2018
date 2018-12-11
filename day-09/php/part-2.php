<?php

gc_disable();
ini_set('memory_limit', -1);

require __DIR__ . '/src/node.php';

$file = in_array('--example', $argv) ? 'input-example.txt' : 'input.txt';

$input = file_get_contents(__DIR__ . "/../$file");

preg_match('/^(\d+) players; last marble is worth (\d+) points/m', $input, $matches);

$totalPlayers = $matches[1] * 1;
$lastMarbleWorth = $matches[2] * 1 * 100;

$playerScores = array_fill(0, $totalPlayers, 0);

$marbleValue = 0;
$marble = new Node(0);

while ($marbleValue < $lastMarbleWorth) {
    $marbleValue++;
    $currentPlayerIndex = ($marbleValue - 1) % $totalPlayers;
    if ($marbleValue % 23 === 0) {
        $playerScores[$currentPlayerIndex] += $marbleValue;
        $toRemove = $marble->getPrev(7);
        $marble = $toRemove->next;
        $removed = $toRemove->remove();
        $playerScores[$currentPlayerIndex] += $removed->data;
        $toRemove = null;
        $removed = null;
    } else {
        $next = new Node($marbleValue);
        $marble->next->addNext($next);
        $marble = $next;
        $next = null;
    }
}

$winningScore = max($playerScores);

echo "winning elf's score: $winningScore";
