<?php

error_reporting(E_ERROR | E_PARSE);

$file = in_array('--example', $argv) ? 'input-example.txt' : 'input.txt';

$input = trim(file_get_contents(__DIR__ . "/../../$file"));

$numbers = array_map(function ($number) {
    return $number * 1;
}, explode(' ', $input));

$code = 65;

function getNode($numbers, $i, &$code)
{
    $pointer = $i * 1;
    $id = chr($code++);
    $quantityChildNodes = $numbers[$pointer];
    $pointer++;
    $quantityMetadataEntries = $numbers[$pointer];
    $pointer++;
    $childNodes = [];
    if ($quantityChildNodes > 0) {
        while (count($childNodes) < $quantityChildNodes) {
            $childNode = getNode($numbers, $pointer, $code);
            $childNodes[] = $childNode;
            $pointer += $childNode['length'];
        }
    }
    $metadataEntries = [];
    for ($p = 0; $p < $quantityMetadataEntries; $p++) {
        $metadataEntries[] = $numbers[$pointer];
        $pointer++;
    }
    $header = compact('quantityChildNodes', 'quantityMetadataEntries');
    $length =
        count($header) +
        array_reduce($childNodes, function ($carry, $node) {
            return $carry + $node['length'];
        }, 0) +
        $header['quantityMetadataEntries'];
    $sumMetadataEntries = array_reduce($metadataEntries, function ($carry, $entry) {
        return $carry + $entry;
    }, 0);
    return compact('id', 'header', 'childNodes', 'metadataEntries', 'length', 'sumMetadataEntries');
}

$tree = getNode($numbers, 0, $code);

return $tree;
