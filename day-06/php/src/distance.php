<?php

return function ($a, $b) {
    return abs($a['x'] - $b['x']) + abs($a['y'] - $b['y']);
};
