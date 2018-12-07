<?php

$sortBy = require(__DIR__ . '/src/sortBy.php');
$styles = require(__DIR__ . '/src/styles.php');
$distance = require(__DIR__ . '/src/distance.php');

$input = array_values(
    explode(PHP_EOL, trim(file_get_contents(__DIR__ . '/../input.txt')))
);

$i = 0;
$points = array_reduce($input, function ($carry, $point) use (&$i) {
    list($x, $y) = array_map(function ($n) {
        return (int) $n;
    }, explode(', ', $point));
    $key = "$x,$y";
    $code = chr(65 + $i);
    $carry[$key] = compact('x', 'y', 'code');
    $i++;
    return $carry;
}, []);

$byX = $sortBy($points, function ($p) {
    return $p['x'];
});
$byY = $sortBy($points, function ($p) {
    return $p['y'];
});
$bounds = [
    'x' => [$byX[0]['x'], end($byX)['x']],
    'y' => [$byY[0]['y'], end($byY)['y']],
];

$output = '';
$size = 0;
for ($row = $bounds['y'][0]; $row <= $bounds['y'][1]; $row++) {
    for ($col = $bounds['x'][0]; $col <= $bounds['x'][1]; $col++) {
        $key = "$col,$row";
        $pos = ['x' => $col, 'y' => $row];
        $rendered = false;
        if (isset($points[$key])) {
            $output .= $styles['green'] . $points[$key]['code'] . $styles['reset'];
            continue;
        }
        $distanceSum = array_reduce($points, function ($carry, $point) use ($pos, $distance) {
            return $carry + $distance($pos, $point);
        }, 0);
        $style = $styles['dim'];
        if ($distanceSum < 10000) {
            $value = '#';
            $style = $styles['red'];
            $size++;
        } else {
            $value = '.';
        }
        if (!$rendered) $output .= $style . $value . $styles['reset'];
    }
    $output .= PHP_EOL;
}

if (in_array('--output', $argv)) echo $output . PHP_EOL;

echo "size of the region: $size";
