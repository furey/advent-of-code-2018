const rsortBy = require('./src/rsortBy');

const sortGuards = guard => {
  const minutes = Object.entries(guard.minutes);
  if (!minutes.length) return 0;
  return rsortBy(
    minutes.map(([minute, count]) => ({ minute, count })),
    minute => minute.count,
  )[0].count;
};

require(__dirname + '/src/shared.js')(sortGuards);
