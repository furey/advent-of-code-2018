<?php

$file = in_array('--example', $argv) ? 'input-example.txt' : 'input.txt';

$input = file_get_contents(__DIR__ . "/../../$file");

$points = array_map(function ($line) {
    preg_match('/^position=<([ -]*\d+), ([ -]*\d+)\> velocity=<([ -]*\d+), ([ -]*\d+)>$/', $line, $matches);
    return [
      'pos' => [ 'x' => $matches[1] * 1, 'y' => $matches[2] * 1 ],
      'vel' => [ 'x' => $matches[3] * 1, 'y' => $matches[4] * 1 ],
    ];
}, explode(PHP_EOL, trim($input)));

function tick($points) {
    $points = array_map(function ($p) {
        $p['pos']['x'] += $p['vel']['x'];
        $p['pos']['y'] += $p['vel']['y'];
        return $p;
    }, $points);
    $x = array_map(function ($p) { return $p['pos']['x']; }, $points);
    $y = array_map(function ($p) { return $p['pos']['y']; }, $points);
    $bounds = [
        'x' => [min($x), max($x)],
        'y' => [min($y), max($y)],
    ];
    $width = abs($bounds['x'][1] - $bounds['x'][0]);
    return compact('points', 'bounds', 'width');
}

$seconds = 0;
$bounds = null;
$width = INF;
$output = '';

while (true) {
    $next = tick($points);
    if ($next['width'] < $width) {
        $points = $next['points'];
        $bounds = $next['bounds'];
        $width = $next['width'];
        $seconds++;
        continue;
    }
    $o = array_reduce($points, function ($carry, $point) {
        $x = $point['pos']['x'];
        $y = $point['pos']['y'];
        $key = "$x,$y";
        $carry[$key] = true;
        return $carry;
    }, []);
    for ($row = $bounds['y'][0]; $row <= $bounds['y'][1]; $row++) {
        for ($col = $bounds['x'][0]; $col <= $bounds['x'][1]; $col++) {
            $key = "$col,$row";
            $output .= isset($o[$key]) ? '#' : '.';
        }
        $output .= PHP_EOL;
    }
    break;
}

return [
    $output,
    $seconds,
];
