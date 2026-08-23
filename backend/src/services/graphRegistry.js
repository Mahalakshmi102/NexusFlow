const { Subject } = require("rxjs");

const graphRegistry = new Map();

/*
  Register a compiled graph for a device
*/
function registerGraph(deviceId, compiledGraph) {
  const input$ = new Subject();

  compiledGraph.connect(input$);

  graphRegistry.set(deviceId, {
    input$,
    compiledGraph
  });

  console.log(`📊 Graph registered for: ${deviceId}`);
}

/*
  Get graph by device ID
*/
function getGraph(deviceId) {
  return graphRegistry.get(deviceId);
}

module.exports = {
  registerGraph,
  getGraph
};