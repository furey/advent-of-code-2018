const {changes, operations} = require(__dirname + '/src/shared');

const frequency = changes.reduce((carry, {operator, value}) => operations[operator](carry, value), 0);

console.log(`frequency: ${frequency}`);
