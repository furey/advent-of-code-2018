const tree = require('./src/shared');

function nodeValue(node) {
  if (!node.childNodes.length) return node.sumMetadataEntries;
  return node.metadataEntries.reduce((carry, entry) => {
    const childNode = node.childNodes[entry - 1] || undefined;
    return carry + (!childNode ? 0 : nodeValue(childNode));
  }, 0);
}

const value = nodeValue(tree);

console.log(`value of the root node: ${value}`);
