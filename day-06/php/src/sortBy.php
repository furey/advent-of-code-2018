<?php

return function ($array, $fn) {
    usort($array, function ($a, $b) use ($fn) {
        $a = $fn($a);
        $b = $fn($b);
        if ($a === $b) return 0;
        return $a < $b ? -1 : 1;
    });
    return $array;
};
