<?php

$tree = require(__DIR__ . '/src/shared.php');

function nodeValue($node)
{
    if (!sizeof($node['childNodes'])) return $node['sumMetadataEntries'];
    return array_reduce($node['metadataEntries'], function ($carry, $entry) use ($node) {
        try {
            $childNode = $node['childNodes'][$entry - 1];
        } catch (Exception $e) {
            return $carry;
        }
        return $carry + nodeValue($childNode);
    }, 0);
}

$value = nodeValue($tree);

echo "value of the root node: $value";
