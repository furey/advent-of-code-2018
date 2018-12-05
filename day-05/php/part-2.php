<?php

$react = require(__DIR__ . '/src/react.php');
$sortBy = require(__DIR__ . '/src/sortBy.php');

$polymer = trim(file_get_contents(__DIR__ . '/../input.txt'));

$results = array_map(function ($type) use ($polymer, $react) {
    $typeless = preg_replace("/$type/i", '', $polymer);
    $length = strlen($react($typeless));
    return compact('type', 'length');
}, str_split('ABCDEFGHIJKLMNOPQRSTUVWXYZ'));

$results = $sortBy($results, function ($result) {
    return $result['length'];
});

$shortest = $results[0];

echo "length of the shortest polymer ('{$shortest['type']}'): {$shortest['length']}";
