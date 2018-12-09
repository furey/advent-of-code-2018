const fs = require('fs');

let input = fs.readFileSync(__dirname + '/../input.txt', 'utf-8');

// input = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2';

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
        sumMetadataEntries: metadataEntries.reduce((carry, entry) => carry + entry, 0),
        length,
    };
}

const tree = getNode(0);

// console.log(tree);

function nodeValue(node) {
    if (!node.childNodes.length) return node.sumMetadataEntries;
    return node.metadataEntries.reduce((carry, entry) => {
        const i = entry - 1;
        const childNode = node.childNodes[i] || undefined;
        return carry + (!childNode ? 0 : nodeValue(childNode));
    }, 0);
}

const value = nodeValue(tree);

console.log(`value of the root node: ${value}`);
