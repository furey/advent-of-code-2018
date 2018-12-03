<?php

$input = array_filter(
    explode(PHP_EOL, file_get_contents(__DIR__ . '/../input.txt'))
);

$counts = array_map(function ($id) {
    return array_filter(count_chars($id, 1), function ($value) {
        return $value >= 2;
    });
}, $input);

$sums = array_reduce($counts, function ($carry, $chars) {
    if (in_array(2, $chars)) $carry['2']++;
    if (in_array(3, $chars)) $carry['3']++;
    return $carry;
}, [
    '2' => 0,
    '3' => 0,
]);

$checksum = array_product($sums);

echo "checksum: $checksum";
