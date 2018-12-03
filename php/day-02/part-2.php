<?php

$input = file_get_contents(__DIR__ . '/input.txt');

$list = array_map(function ($id) {
    $chars = str_split($id);
    return compact('id', 'chars');
}, array_filter(explode(PHP_EOL, $input)));

$prototypes = array_reduce($list, function ($carry, $item) use ($list) {
    foreach ($list as $other) {
        if ($item['id'] === $other['id']) continue;
        $diff = array_diff_assoc($item['chars'], $other['chars']);
        if (count($diff) !== 1) continue;
        $carry[] = $item;
    }
    return $carry;
}, []);

$commonLetters = implode('', array_reduce($prototypes, function ($carry, $item) {
    if (!$carry) return $item;
    return array_intersect_assoc($carry['chars'], $item['chars']);
}));

echo "common letters: $commonLetters";
