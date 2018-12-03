<?php

$input = file_get_contents(__DIR__ . '/../input.txt');

$changes = array_map(function ($change) {
    $operator = $change[0];
    $value = substr($change, 1) * 1;
    return compact('operator', 'value');
}, array_filter(explode(PHP_EOL, $input)));

$operations = [
    '+' => function ($x, $y) { return $x + $y; },
    '-' => function ($x, $y) { return $x - $y; },
];

$frequency = 0;
$frequencies = [];
$firstFrequencyReachedTwice = null;

while ($firstFrequencyReachedTwice === null) {
    for ($i = 0; $i < count($changes); $i++) {
        $change = $changes[$i];
        $frequency = $operations[$change['operator']]($frequency, $change['value']);
        if (in_array($frequency, $frequencies)) {
            $firstFrequencyReachedTwice = $frequency;
            break;
        }
        $frequencies[] = $frequency;
    }
}

echo "first frequency reached twice: $firstFrequencyReachedTwice";
