const tree = require('./src/shared');

function sumMetadataEntries(node) {
  let sum = node.sumMetadataEntries;
  if (!node.childNodes.length) return sum;
  return sum + node.childNodes.reduce((carry, childNode) => carry + sumMetadataEntries(childNode), 0);
}

const sum = sumMetadataEntries(tree);

console.log(`sum of all metadata entries: ${sum}`);
