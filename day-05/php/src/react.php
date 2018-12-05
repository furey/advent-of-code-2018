<?php

return function ($polymer) {
    $units = str_split($polymer);
    $index = 0;
    while (true) {
        if ($index === count($units) - 1) break;
        $a = $units[$index];
        $b = $units[$index + 1];
        if (strtoupper($a) === strtoupper($b) && $a !== $b) {
            array_splice($units, $index, 2);
            $index = max(0, $index - 1);
            continue;
        }
        $index++;
    }
    return implode('', $units);
};
