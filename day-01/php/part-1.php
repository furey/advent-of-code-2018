<?php

list($changes, $operations) = require(__DIR__ . '/src/shared.php');

$frequency = array_reduce($changes, function ($carry, $change) use ($operations) {
    return $operations[$change['operator']]($carry, $change['value']);
}, 0);

echo "frequency: $frequency";
