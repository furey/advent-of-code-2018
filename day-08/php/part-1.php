<?php

$tree = require(__DIR__ . '/src/shared.php');

function sumMetadataEntries($node)
{
    $sum = $node['sumMetadataEntries'];
    if (!count($node['childNodes'])) return $sum;
    return $sum + array_reduce($node['childNodes'], function ($carry, $childNode) {
        return $carry + sumMetadataEntries($childNode);
    }, 0);
}

$sum = sumMetadataEntries($tree);

echo "sum of all metadata entries: $sum";
