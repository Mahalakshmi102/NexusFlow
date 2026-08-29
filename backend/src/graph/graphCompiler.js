function compileGraph(nodes, edges) {
  const nodeMap = {};
  const adjacencyList = {};

  // Store nodes
  for (const node of nodes) {
    nodeMap[node.id] = node;
    adjacencyList[node.id] = [];
  }

  // Store connections
  for (const edge of edges) {
    if (adjacencyList[edge.source]) {
      adjacencyList[edge.source].push(edge.target);
    }
  }

  return {
    nodeMap,
    adjacencyList
  };
}

module.exports = {
  compileGraph
};
