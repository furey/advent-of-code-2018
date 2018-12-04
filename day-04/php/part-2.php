<?php

$sortGuards = function ($guard) {
    arsort($guard['minutes']);
    return current($guard['minutes']);
};

require(__DIR__ . '/src/shared.php');
