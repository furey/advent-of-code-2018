<?php

$file = in_array('--example', $argv) ? 'input-example.txt' : 'input.txt';

$input = file_get_contents(__DIR__ . "/../$file");

preg_match('/^(\d+)$/m', trim($input), $matches);

$gridSerialNumber = +$matches[1];

$gridSize = 300;

$cells = [];
for ($row = 1; $row <= $gridSize; $row++) {
    $cells[$row] = [];
    for ($col = 1; $col <= $gridSize; $col++) {
        $rackId = $col + 10;
        $powerLevel = $rackId * $row;
        $powerLevel += $gridSerialNumber;
        $powerLevel *= $rackId;
        $powerLevel = +(substr($powerLevel, -3, -2));
        $powerLevel -= 5;
        $cells[$row][$col] = $powerLevel;
    }
}

$size = 3;
$largestTotalPower = 0;
$largestIdentifier;
for ($row = 1; $row <= $gridSize - ($size - 1); $row++) {
    for ($col = 1; $col <= $gridSize - ($size - 1); $col++) {
        $key = "$col,$row";
        $totalPower = 0;
        for ($i = 0; $i <= $size - 1; $i++) {
            for ($j = 0; $j <= $size - 1; $j++) {
                $totalPower += $cells[$row + $i][$col + $j];
            }
        }
        if ($totalPower >= $largestTotalPower) {
            $largestTotalPower = $totalPower;
            $largestIdentifier = $key;
        }
    }
}

echo "X,Y coordinate with the largest total power: $largestIdentifier ($largestTotalPower)";
