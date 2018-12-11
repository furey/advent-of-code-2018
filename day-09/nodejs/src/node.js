class Node {
  constructor(data) {
    this.data = data;
    this.next = this;
    this.prev = this;
  }

  getPrev(steps) {
    let node = this;
    for (var i = 1; i <= steps; i++) node = node.prev;
    return node;
  }

  addNext(node) {
    this.next.prev = node;
    node.next = this.next;
    node.prev = this;
    this.next = node;
  }

  remove() {
    const prev = this.prev;
    const next = this.next;
    prev.next = next;
    next.prev = prev;
    this.next = null;
    this.prev = null;
    return this;
  }
}

module.exports = Node;
