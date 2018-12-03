<?php

$input = file_get_contents(__DIR__ . '/../../input.txt');

$changes = array_map(function ($change) {
    $operator = $change[0];
    $value = substr($change, 1) * 1;
    return compact('operator', 'value');
}, array_filter(explode(PHP_EOL, $input)));

$operations = [
    '+' => function ($x, $y) {
        return $x + $y;
    },
    '-' => function ($x, $y) {
        return $x - $y;
    },
];

return [
    $changes,
    $operations,
];
