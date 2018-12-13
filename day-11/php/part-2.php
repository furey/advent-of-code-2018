<?php

ini_set('memory_limit', -1);

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

$squares = [];
$size = 1;
$largestTotalPower = 0;
$largestIdentifier;
while ($size <= $gridSize) {
    for ($row = 1; $row <= $gridSize - ($size - 1); $row++) {
        for ($col = 1; $col <= $gridSize - ($size - 1); $col++) {
            $key = "$col,$row,$size";
            $prevSize = $size - 1;
            $prevKey = "$col,$row,$prevSize";
            $totalPower = 0;
            if (isset($squares[$prevKey])) {
                $totalPower = $squares[$prevKey];
                $rightCol = $col + ($size - 1);
                $bottomRow = $row + ($size - 1);
                for ($bottomCol = $col; $bottomCol <= $rightCol; $bottomCol++) {
                    $totalPower += $cells[$bottomRow][$bottomCol];
                }
                for ($rightRow = $row; $rightRow <= $row + ($size - 2); $rightRow++) {
                    $totalPower += $cells[$rightRow][$rightCol];
                }
            } else {
                for ($i = 0; $i <= $size - 1; $i++) {
                    for ($j = 0; $j <= $size - 1; $j++) {
                        $totalPower += $cells[$row + $i][$col + $j];
                    }
                }
            }
            $squares[$key] = $totalPower;
            if ($totalPower >= $largestTotalPower) {
                $largestTotalPower = $totalPower;
                $largestIdentifier = $key;
            }
        }
    }
    $size++;
}

echo "X,Y,size identifier with the largest total power: $largestIdentifier ($largestTotalPower)";
