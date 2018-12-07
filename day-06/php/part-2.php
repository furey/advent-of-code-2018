<?php

$sortBy = require(__DIR__ . '/src/sortBy.php');
$distance = require(__DIR__ . '/src/distance.php');

$input = file_get_contents(__DIR__ . '/../input.txt');

$input = array_values(explode(PHP_EOL, trim($input)));

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

$style = [
  'reset' => "\e[0m",
  'dim' => "\e[030m",
  'green' => "\e[032m",
  'red' => "\e[031m",
];

$output = '';
$size = 0;
for ($row = $bounds['y'][0]; $row <= $bounds['y'][1]; $row++) {
    for ($col = $bounds['x'][0]; $col <= $bounds['x'][1]; $col++) {
        $key = "$col,$row";
        $pos = ['x' => $col, 'y' => $row];
        $rendered = false;
        if (isset($points[$key])) {
            $output .= $style['green'] . $points[$key]['code'] . $style['reset'];
            continue;
        }
        $distanceSum = array_reduce($points, function ($carry, $point) use ($pos, $distance) {
            return $carry + $distance($pos, $point);
        }, 0);
        $s = $style['dim'];
        if ($distanceSum < 10000) {
            $value = '#';
            $s = $style['red'];
            $size++;
        } else {
            $value = '.';
        }
        if (!$rendered) $output .= $s . $value . $style['reset'];
    }
    $output .= PHP_EOL;
}

// echo $output . PHP_EOL; // Uncomment to visualise grid in console (note: set your text size very small).

echo "size of the region: $size";
