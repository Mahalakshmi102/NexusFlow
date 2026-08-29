function triggerAlert(node, telemetry) {
  console.log("\n🚨 ALERT TRIGGERED");

  console.log("Action Node:", node.id);

  console.log("Message:", node.data.message || "Rule matched");

  console.log("Telemetry:", telemetry);

  console.log("-------------------------\n");
}

module.exports = {
  triggerAlert
};
