<?php

$file = in_array('--example', $argv) ? 'input-example-part-1.txt' : 'input.txt';

$input = file_get_contents(__DIR__ . "/../$file");

$lines = array_filter(explode(PHP_EOL, $input));
$height = count($lines);
$width = max(array_map(function ($line) {
    return strlen($line);
}, $lines));

$carts = [];
$grid = [];
for ($row = 0; $row < $height; $row ++) {
    $line = $lines[$row];
    for ($col = 0; $col < $width; $col++) {
        $value = trim(substr($line, $col, 1)) ?: null;
        $key = "$col,$row";
        $grid[$key] = $value;
        if (in_array($value, ['^','v','<','>'])) {
            $carts[] = [
                'id' => count($carts),
                'pos' => compact('col', 'row'),
                'dir' => $value,
                'intersections' => 0,
                'smashed' => false,
            ];
        }
    }
}

foreach ($carts as $i => $cart) {
    $pos = $cart['pos'];
    $dir = $cart['dir'];
    $col = $pos['col'];
    $row = $pos['row'];
    $key = "$col,$row";
    $track = in_array($dir, ['>','<']) ? '-' : '|';
    $grid[$key] = $track;
}

function render()
{
    global $grid, $carts, $width, $height;
    $output = '';
    for ($row = 0; $row < $height; $row++) {
        for ($col = 0; $col < $width; $col++) {
            $value = $grid["$col,$row"] ?: ' ';
            $cart = null;
            foreach ($carts as $c) {
                if ($c['pos']['col'] === $col && $c['pos']['row'] === $row) {
                    $cart = $c;
                    break;
                }
            }
            $output .= $cart ? ($cart['smashed'] ? 'X' : $cart['dir']) : $value;
        }
        $output .= PHP_EOL;
    }
    echo($output);
}

$output = in_array('--output', $argv);

$tickEvery = in_array('--tickEvery', $argv)
    ? +$argv[array_search('--tickEvery', $argv) + 1]
    : 1;

if ($output) render();

while (true) {
    if ($output) usleep($tickEvery * 1000000);
    usort($carts, function ($a, $b) {
        if ($a['pos']['row'] === $b['pos']['row']) {
            if ($a['pos']['col'] === $b['pos']['col']) return 0;
            return $a['pos']['col'] < $b['pos']['col'] ? -1 : 1;
        }
        return $a['pos']['row'] < $b['pos']['row'] ? -1 : 1;
    });
    for ($i = 0; $i < count($carts); $i++) {
        $cart = $carts[$i];
        $col = $cart['pos']['col'];
        $row = $cart['pos']['row'];
        $key = "$col,$row";
        $nextDir = $cart['dir'];
        switch ($cart['dir']) {
            case '>':
                $nextKey = ($col+1).",$row";
                $carts[$i]['pos']['col']++;
                break;
            case '<':
                $nextKey = ($col-1).",$row";
                $carts[$i]['pos']['col']--;
                break;
            case 'v':
                $nextKey = "$col,".($row+1);
                $carts[$i]['pos']['row']++;
                break;
            case '^':
                $nextKey = "$col,".($row-1);
                $carts[$i]['pos']['row']--;
                break;
        }
        switch ($grid[$nextKey]) {
            case '\\':
                if ($cart['dir'] === '>') $nextDir = 'v';
                if ($cart['dir'] === '<') $nextDir = '^';
                if ($cart['dir'] === 'v') $nextDir = '>';
                if ($cart['dir'] === '^') $nextDir = '<';
                break;
            case '/':
                if ($cart['dir'] === '>') $nextDir = '^';
                if ($cart['dir'] === '<') $nextDir = 'v';
                if ($cart['dir'] === 'v') $nextDir = '<';
                if ($cart['dir'] === '^') $nextDir = '>';
                break;
            case '+':
                $carts[$i]['intersections']++;
                switch ($carts[$i]['intersections'] % 3) {
                    case 1:
                        if ($cart['dir'] === '>') $nextDir = '^';
                        if ($cart['dir'] === '<') $nextDir = 'v';
                        if ($cart['dir'] === 'v') $nextDir = '>';
                        if ($cart['dir'] === '^') $nextDir = '<';
                        break;
                    case 0:
                        if ($cart['dir'] === '>') $nextDir = 'v';
                        if ($cart['dir'] === '<') $nextDir = '^';
                        if ($cart['dir'] === 'v') $nextDir = '<';
                        if ($cart['dir'] === '^') $nextDir = '>';
                        break;
                }
                break;
        }
        $carts[$i]['dir'] = $nextDir;
        if ($output) system('clear');
        $otherIndex = null;
        foreach ($carts as $index => $other) {
            if ($other['id'] !== $cart['id'] &&
                $other['pos']['col'] === $carts[$i]['pos']['col'] &&
                $other['pos']['row'] === $carts[$i]['pos']['row']) {
                $otherIndex = $index;
                break;
            }
        }
        if ($otherIndex !== null) {
            $carts[$i]['smashed'] = true;
            $carts[$otherIndex]['smashed'] = true;
            if ($output) render();
            exit(sprintf('location of the first crash: %d,%d', $carts[$i]['pos']['col'], $carts[$i]['pos']['row']));
        }
        if ($output) render();
    }
}
