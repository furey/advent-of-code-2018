<?php

if (!isset($sortGuards)) throw new Exception('$sortGuards function required in scope.');

$sortBy = require(__DIR__ . '/sortBy.php');
$rsortBy = require(__DIR__ . '/rsortBy.php');

$input = array_values(
    array_filter(
        explode(PHP_EOL, file_get_contents(__DIR__ . '/../../input.txt'))
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
    switch ($entry['observation']) {
        case 'falls asleep':
            $guard['start'] = $entry['date']->modify('0 sec');
            break;
        case 'wakes up':
            if (isset($guard['start'])) {
                $minutes = $entry['date']->diff($guard['start'])->i;
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

$rsortBy($guards, $sortGuards);

$sleepiestGuard = $guards[0];
$sleepiestGuardId = $sleepiestGuard['id'];
arsort($sleepiestGuard['minutes']);
$sleepiestMinute = key($sleepiestGuard['minutes']);

$idMultipliedByMinute = (int) $sleepiestGuardId * (int) $sleepiestMinute;

echo implode(PHP_EOL, [
    "sleepiest guard id: $sleepiestGuardId",
    '*',
    "sleepiest minute: $sleepiestMinute",
    '=',
    $idMultipliedByMinute
]);
