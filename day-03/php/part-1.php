<?php

list($claims, $claimedFabric) = require(__DIR__ . '/src/shared.php');

$sharedFabric = count(array_filter($claimedFabric, function ($claimIds) {
    return count($claimIds) >= 2;
}));

echo "shared fabric: $sharedFabric";
