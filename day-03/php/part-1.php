<?php

$input = file_get_contents(__DIR__ . '/../input.txt');

$claims = array_map(function ($claim) {
    $matches = null;
    preg_match('/^#(\d+)\s@\s(\d+),(\d+):\s(\d+)x(\d+)/i', $claim, $matches);
    return [
        'claim' => $claim,
        'id' => $matches[1],
        'x' => $matches[2],
        'y' => $matches[3],
        'w' => $matches[4],
        'h' => $matches[5],
    ];
}, array_filter(explode(PHP_EOL, $input)));

$claimedFabric = array_reduce($claims, function ($carry, $claim) {
    for ($x = $claim['x']; $x < $claim['x'] + $claim['w']; $x++) {
        for ($y = $claim['y']; $y < $claim['y'] + $claim['h']; $y++) {
            $key = "$x,$y";
            if (isset($carry[$key])) {
                $carry[$key]++;
            } else {
                $carry[$key] = 1;
            }
        }
    }
    return $carry;
}, []);

$sharedFabric = count(array_filter($claimedFabric, function ($count) {
    return $count >= 2;
}));

echo "shared fabric: $sharedFabric";
