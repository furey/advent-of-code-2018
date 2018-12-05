<?php

$react = require(__DIR__ . '/src/react.php');

$polymer = trim(file_get_contents(__DIR__ . '/../input.txt'));

$unitsRemaining = strlen($react($polymer));

echo "units remaining: $unitsRemaining";
