const {
  createTelemetryPipeline,
  createMovingAveragePipeline
} = require("../pipeline/rxjsCompiler");

const {
  evaluateNodeRule
} = require("../rules/ruleEvaluator");

const {
  triggerAlert
} = require("../actions/alertService");

class GraphExecutor {
  constructor(graph) {
    this.graph = graph;

    this.telemetry$ = createTelemetryPipeline();

    this.deviceNodeMap = {};

    this.setupDeviceMapping();
  }

  setupDeviceMapping() {
    const { nodeMap } = this.graph;

    for (const nodeId in nodeMap) {
      const node = nodeMap[nodeId];

      if (node.type === "sensor") {
        const deviceId = node.data.deviceId;

        if (deviceId) {
          this.deviceNodeMap[deviceId] = node.id;
        }
      }
    }

    console.log("Device Mapping:");
    console.log(this.deviceNodeMap);
  }

  receiveTelemetry(telemetry) {
    const deviceId = telemetry.deviceId;

    const sourceNodeId =
      this.deviceNodeMap[deviceId];

    if (!sourceNodeId) {
      console.log(
        `No sensor node found for device: ${deviceId}`
      );

      return;
    }

    console.log("\n📡 TELEMETRY RECEIVED");

    console.log("Device:", deviceId);

    console.log(
      "Source Node:",
      sourceNodeId
    );

    // Start graph execution
    this.executeNode(
      sourceNodeId,
      telemetry,
      new Set()
    );
  }

  executeNode(nodeId, telemetry, visited) {
    if (visited.has(nodeId)) {
      return;
    }

    visited.add(nodeId);

    const node =
      this.graph.nodeMap[nodeId];

    if (!node) {
      return;
    }

    console.log(
      `Executing node: ${node.id} (${node.type})`
    );

    switch (node.type) {

      case "sensor":
        this.sendToNextNodes(
          nodeId,
          telemetry,
          visited
        );
        break;

      case "movingAverage":
        this.executeMovingAverage(
          node,
          telemetry,
          visited
        );
        break;

      case "rule":
        this.executeRule(
          node,
          telemetry,
          visited
        );
        break;

      case "alert":
        triggerAlert(
          node,
          telemetry
        );
        break;

      default:
        console.log(
          `Unknown node type: ${node.type}`
        );
    }
  }

  executeMovingAverage(
    node,
    telemetry,
    visited
  ) {
    const field =
      node.data.field;

    const windowSize =
      node.data.windowSize || 5;

    const pipeline =
      createMovingAveragePipeline(
        this.telemetry$,
        field,
        windowSize
      );

    const subscription =
      pipeline.subscribe(
        processedTelemetry => {

          console.log(
            "Moving Average Result:",
            processedTelemetry
          );

          this.sendToNextNodes(
            node.id,
            processedTelemetry,
            visited
          );

          subscription.unsubscribe();
        }
      );

    this.telemetry$.next(telemetry);
  }

  executeRule(
    node,
    telemetry,
    visited
  ) {
    const ruleMatched =
      evaluateNodeRule(
        node,
        telemetry
      );

    if (ruleMatched) {
      console.log(
        "✅ Rule matched"
      );

      this.sendToNextNodes(
        node.id,
        telemetry,
        visited
      );
    } else {
      console.log(
        "❌ Rule not matched"
      );
    }
  }

  sendToNextNodes(
    nodeId,
    telemetry,
    visited
  ) {
    const nextNodes =
      this.graph.adjacencyList[nodeId] || [];

    for (const nextNodeId of nextNodes) {
      this.executeNode(
        nextNodeId,
        telemetry,
        new Set(visited)
      );
    }
  }
}

module.exports = {
  GraphExecutor
};