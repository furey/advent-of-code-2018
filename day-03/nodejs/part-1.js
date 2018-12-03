const {fabric} = require(__dirname + '/src/shared.js');

const sharedInchesOfFabric = Object.entries(fabric)
  .filter(([, claimIds]) => claimIds.length >= 2)
  .length;

console.log(`shared inches of fabric: ${sharedInchesOfFabric}`);
