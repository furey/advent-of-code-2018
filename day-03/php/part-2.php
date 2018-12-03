<?php

$input = file_get_contents(__DIR__ . '/../input.txt');

ini_set('memory_limit', -1);

$data = array_map(function ($claim) {
    $matches = null;
    preg_match('/^#(\d+)\s@\s(\d+),(\d+):\s(\d+)x(\d+)/i', $claim, $matches);
    $id = $matches[1];
    return [
        'key' => $id,
        'values' => [
            'id' => $matches[1],
            'x' => $matches[2],
            'y' => $matches[3],
            'w' => $matches[4],
            'h' => $matches[5],
        ],
    ];
}, array_values(array_filter(explode(PHP_EOL, $input))));

$keys = array_map(function ($item) {
    return $item['key'];
}, $data);

$values = array_map(function ($item) {
    return $item['values'];
}, $data);

unset($data);

$claims = array_combine($keys, $values);

unset($keys, $values);

$claimedFabric = [];

foreach ($claims as $id => $claim) {
    for ($y = $claim['y']; $y < $claim['y'] + $claim['h']; $y++) {
        for ($x = $claim['x']; $x < $claim['x'] + $claim['w']; $x++) {
            $position = "$x,$y";
            if (!isset($claimedFabric[$position])) $claimedFabric[$position] = [];
            $claimedFabric[$position][] = $claim['id'];
            if (count($claimedFabric[$position]) < 2) continue;
            foreach ($claimedFabric[$position] as $id) $claims[$id]['overlaps'] = true;
        }
    }
}

unset($claimedFabric);

$intactFabric = array_filter($claims, function ($claim) {
    return !isset($claim['overlaps']);
});

$intactFabricId = current($intactFabric)['id'];

echo "intact fabric id: $intactFabricId";
