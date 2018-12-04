const fs = require('fs');
const sortBy = require('./sortBy');
const rsortBy = require('./rsortBy');

module.exports = function (sortGuards)
{
  if (typeof sortGuards !== 'function') throw 'sortGuards function required.';

  const input = fs.readFileSync(__dirname + '/../../input.txt', 'utf-8')
    .split('\n')
    .filter(s => s.length);

  let entries = input.map(entry => {
    const [date, observation] = entry.split(/^\[(.*)\] (.*)$/).filter(s => s.length);
    return {
      date: new Date(date),
      observation,
    };
  });

  entries = sortBy(entries, entry => entry.date.getTime());

  let id = null;

  const guards = entries.reduce((carry, entry) => {
    const found = entry.observation.match(/^Guard #(\d+)/);
    if (found) {
      id = found[1];
      if (carry[id] === undefined) carry[id] = { id, total: 0, minutes: {}};
    }
    const guard = carry[id];
    switch (entry.observation) {
      case 'falls asleep':
        guard.start = new Date(+entry.date);
        break;
      case 'wakes up':
        if (guard.start !== undefined) {
          const startMinutes = guard.start.getMinutes();
          const minutes = entry.date.getMinutes() - startMinutes;
          const endMinutes = startMinutes + minutes;
          for (let m = startMinutes; m < endMinutes; m++) {
            const key = m;
            if (guard.minutes[key] === undefined) {
              guard.minutes[key] = 1;
            } else {
              guard.minutes[key]++;
            }
          }
          guard.total += minutes;
          guard.start = null;
        }
        break;
    }
    carry[id] = guard;
    return carry;
  }, {});

  const sleepiestGuard = rsortBy(
    Object.entries(guards).map(([, guard]) => guard),
    sortGuards
  )[0];

  const sleepiestGuardId = sleepiestGuard.id;
  
  const sleepiestMinute = rsortBy(
    Object.entries(sleepiestGuard.minutes).map(([minute, count]) => ({ minute, count })),
    minute => minute.count,
  )[0].minute;

  const idMultipliedByMinute = Number(sleepiestGuardId) * Number(sleepiestMinute);

  console.log([
    `sleepiest guard id: ${sleepiestGuardId}`,
    '*',
    `sleepiest minute: ${sleepiestMinute}`,
    '=',
    `${idMultipliedByMinute}`
  ].join('\n'));
};
