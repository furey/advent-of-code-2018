<?php

list($changes, $operations) = require(__DIR__ . '/src/shared.php');

$frequency = 0;
$frequencies = [];
$firstFrequencyReachedTwice = null;

while ($firstFrequencyReachedTwice === null) {
    for ($i = 0; $i < count($changes); $i++) {
        $change = $changes[$i];
        $frequency = $operations[$change['operator']]($frequency, $change['value']);
        if (in_array($frequency, $frequencies)) {
            $firstFrequencyReachedTwice = $frequency;
            break;
        }
        $frequencies[] = $frequency;
    }
}

echo "first frequency reached twice: $firstFrequencyReachedTwice";
