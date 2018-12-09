const fs = require('fs');

const file = process.argv.includes('--example') ? 'input-example.txt' : 'input.txt';

const input = fs.readFileSync(__dirname + `/../${file}` , 'utf-8');

const numbers = input.split(' ').map(n => n*1);

let code = 65;

function getNode(i) {
    let pointer = i * 1;
    const id = String.fromCharCode(code++);
    const quantityChildNodes = numbers[pointer];
    pointer++;
    const quantityMetadataEntries = numbers[pointer];
    pointer++;
    const childNodes = [];
    if (quantityChildNodes > 0) {
        let childNode;
        while (childNodes.length < quantityChildNodes) {
            childNode = getNode(pointer);
            childNodes.push(childNode);
            pointer += childNode.length;
        }
    }
    const metadataEntries = [];
    for (let p = 0; p < quantityMetadataEntries; p++) {
        metadataEntries.push(numbers[pointer]);
        pointer++;
    }
    const header = {
        quantityChildNodes,
        quantityMetadataEntries,
    };
    const length =
        Object.entries(header).length +
        childNodes.reduce((carry, node) => carry + node.length, 0) +
        header.quantityMetadataEntries;
    return {
        id,
        header,
        childNodes,
        metadataEntries,
        length,
    };
}

const tree = getNode(0);

function sumMetadataEntries(node) {
    let sum = node.metadataEntries.reduce((carry, entry) => carry + entry, 0);
    if (!node.childNodes.length) return sum;
    return sum + node.childNodes.reduce((carry, childNode) => carry + sumMetadataEntries(childNode), 0);
}

const sum = sumMetadataEntries(tree);

console.log(`sum of all metadata entries: ${sum}`);
