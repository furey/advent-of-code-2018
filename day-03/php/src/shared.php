<?php

ini_set('memory_limit', -1);

$input = array_values(
    array_filter(
        explode(PHP_EOL, file_get_contents(__DIR__ . '/../../input.txt'))
    )
);

$claims = [];

foreach ($input as $claim) {
    $matches = null;
    preg_match('/^#(\d+)\s@\s(\d+),(\d+):\s(\d+)x(\d+)/i', $claim, $matches);
    $id = $matches[1];
    $claims[$id] = [
        'id' => $id,
        'x' => $matches[2],
        'y' => $matches[3],
        'w' => $matches[4],
        'h' => $matches[5],
    ];
}

$fabric = [];

foreach ($claims as $claim) {
    for ($y = $claim['y']; $y < $claim['y'] + $claim['h']; $y++) {
        for ($x = $claim['x']; $x < $claim['x'] + $claim['w']; $x++) {
            $pos = "$x,$y";
            if (!isset($fabric[$pos])) $fabric[$pos] = [];
            $fabric[$pos][] = $claim['id'];
            if (count($fabric[$pos]) < 2) continue;
            foreach ($fabric[$pos] as $id) $claims[$id]['overlaps'] = true;
        }
    }
}

return [
    $claims,
    $fabric,
];
