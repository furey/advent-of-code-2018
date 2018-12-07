<?php

$sortBy = require(__DIR__ . '/src/sortBy.php');
$rsortBy = require(__DIR__ . '/src/rsortBy.php');
$distance = require(__DIR__ . '/src/distance.php');

$input = file_get_contents(__DIR__ . '/../input.txt');

// $input = '
// 1, 1
// 1, 6
// 8, 3
// 3, 4
// 5, 5
// 8, 9
// ';

$input = array_values(explode(PHP_EOL, trim($input)));

$i = 0;
$points = array_reduce($input, function ($carry, $point) use (&$i) {
    list($x, $y) = array_map(function ($n) {
        return (int) $n;
    }, explode(', ', $point));
    $key = "$x,$y";
    $code = chr(65 + $i);
    $area = 1;
    $carry[$key] = compact('key', 'x', 'y', 'code', 'area');
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
for ($row = $bounds['y'][0]; $row <= $bounds['y'][1]; $row++) {
    for ($col = $bounds['x'][0]; $col <= $bounds['x'][1]; $col++) {
        $key = "$col,$row";
        $pos = ['x' => $col, 'y' => $row];
        if (isset($points[$key])) {
            $output .= $style['green'] . $points[$key]['code'] . $style['reset'];
            continue;
        }
        $distances = array_reduce($points, function ($carry, $point) use ($pos, $distance) {
            $carry[] = [
                'key' => $point['key'],
                'distance' => $distance($pos, $point),
            ];
            return $carry;
        }, []);
        $closest = $sortBy($distances, function ($item) {
            return $item['distance'];
        });
        $s = $style['dim'];
        if ($closest[0]['distance'] === $closest[1]['distance']) {
            $value = '.';
        } else {
            $key = $closest[0]['key'];
            $value = strtolower($points[$key]['code']);
            $points[$key]['area']++;
        }
        if (in_array($col, $bounds['x']) || in_array($row, $bounds['y'])) {
            $s = $style['red'];
            if (isset($points[$key])) $points[$key]['infinite'] = true;
        }
        $output .= $s . $value . $style['reset'];
    }
    $output .= PHP_EOL;
}

$largest = $rsortBy(array_filter($points, function ($point) {
    return !isset($point['infinite']);
}), function ($point) {
    return $point['area'];
})[0];

// echo $output . PHP_EOL; // Uncomment to visualise grid in console (note: set your text size very small).

echo "size of the largest finite area ('{$largest['x']},{$largest['y']}' aka '{$largest['code']}'): {$largest['area']}";
