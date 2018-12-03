<?php

list($claims, $fabric) = require(__DIR__ . '/src/shared.php');

$nonOverlappingClaims = array_filter($claims, function ($claim) {
    return !isset($claim['overlaps']);
});

$nonOverlappingClaimId = current($nonOverlappingClaims)['id'];

echo "non-overlapping claim id: $nonOverlappingClaimId";
