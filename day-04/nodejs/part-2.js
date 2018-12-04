const rsortBy = require('./src/rsortBy');

const sortGuards = guard => {
  const minutes = Object.entries(guard.minutes).map(([minute, count]) => ({ minute, count }));
  if (!minutes.length) return 0;
  return rsortBy(minutes, minute => minute.count)[0].count;
};

require(__dirname + '/src/shared.js')(sortGuards);
