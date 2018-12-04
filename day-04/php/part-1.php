<?php

ini_set('memory_limit', -1);

$sortBy = require(__DIR__ . '/src/sortBy.php');
$rsortBy = require(__DIR__ . '/src/rsortBy.php');

$input = array_values(
    array_filter(
        explode(PHP_EOL, file_get_contents(__DIR__ . '/../input.txt'))
    )
);

$entries = array_map(function ($entry) {
    $matches = [];
    preg_match('/^\[(.*)\] (.*)$/', $entry, $matches);
    $date = DateTimeImmutable::createFromFormat('Y-m-d H:i', $matches[1]);
    $observation = $matches[2];
    return compact('date', 'observation');
}, $input);

$sortBy($entries, function ($entry) {
    return $entry['date']->getTimestamp();
});

function debug($entry, $id, $message) {
    echo sprintf(
        '[%s] %d: %s',
        $entry['date']->format('Y-m-d H:i'),
        $id,
        $message
    ) . PHP_EOL;
}

$guards = [];
$id = null;

foreach ($entries as $entry) {
    $matches = [];
    if (preg_match('/^Guard #(\d+)/', $entry['observation'], $matches)) {
        $id = $matches[1];
        if (!isset($guards[$id])) {
            $guards[$id] = [
                'id' => $id,
                'total' => 0,
                'minutes' => [],
            ];
        }
    }
    $guard = &$guards[$id];
    debug($entry, $id, $entry['observation']);
    switch ($entry['observation']) {
        case 'falls asleep':
            $guard['start'] = $entry['date']->modify('0 sec');
            break;
        case 'wakes up':
            if (isset($guard['start'])) {
                $minutes = $entry['date']->diff($guard['start'])->i;
                debug($entry, $id, "...was asleep for $minutes minutes");
                $startMinutes = (int) $guard['start']->format('i');
                $endMinutes = $startMinutes + $minutes;
                for ($m = $startMinutes; $m < $endMinutes; $m++) {
                    $key = (string) $m;
                    if (!isset($guard['minutes'][$key])) {
                        $guard['minutes'][$key] = 1;
                    } else {
                        $guard['minutes'][$key]++;
                    }
                }
                $guard['total'] += $minutes;
                $guard['start'] = null;
            }
            break;
    }
}

$rsortBy($guards, function ($guard) {
    return $guard['total'];
});

$sleepiestGuard = $guards[0];

arsort($sleepiestGuard['minutes']);

$sleepiestMinute = key($sleepiestGuard['minutes']);

$idMultipliedByMinute = (int) $sleepiestGuard['id'] * (int) $sleepiestMinute;

echo "sleepiest guard id multiplied by sleepiest minute: $idMultipliedByMinute";
