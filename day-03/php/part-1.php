<?php

list(, $fabric) = require(__DIR__ . '/src/shared.php');

$sharedInchesOfFabric = count(array_filter($fabric, function ($claimIds) {
    return count($claimIds) >= 2;
}));

echo "shared inches of fabric: $sharedInchesOfFabric";
