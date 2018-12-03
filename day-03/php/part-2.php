<?php

list($claims, $claimedFabric) = require(__DIR__ . '/src/shared.php');

$intactFabric = array_filter($claims, function ($claim) {
    return !isset($claim['overlaps']);
});

$intactFabricId = current($intactFabric)['id'];

echo "intact fabric id: $intactFabricId";
