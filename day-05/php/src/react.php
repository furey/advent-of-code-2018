<?php

return function ($polymer) {
    $index = 0;
    while (true) {
        if ($index === strlen($polymer) - 1) break;
        $a = $polymer[$index];
        $b = $polymer[$index + 1];
        if (strtoupper($a) === strtoupper($b) && $a !== $b) {
            $polymer = preg_replace("/$a$b/", '', $polymer, 1);
            $index = max(0, $index - 1);
            continue;
        }
        $index++;
    }
    return $polymer;
};
