const { map, filter } = require("rxjs/operators");

class CompiledGraph {
  constructor(deviceId) {
    this.deviceId = deviceId;
  }

  connect(input$) {

    console.log(
      `🔗 Connecting compiled graph for ${this.deviceId}`
    );

    this.subscription = input$
      .pipe(

        /*
          Extract temperature
        */
        map((telemetry) => {
          return {
            deviceId: telemetry.deviceId,
            temperature: telemetry.temperature,
            timestamp: telemetry.timestamp || new Date().toISOString()
          };
        }),

        /*
          Rule:
          Only allow temperature > 80
        */
        filter((data) => {
          return data.temperature > 80;
        })

      )
      .subscribe({
        next: (data) => {

          console.log("🚨 ALERT!");

          console.log(
            `Device: ${data.deviceId}`
          );

          console.log(
            `Temperature: ${data.temperature}°C`
          );

          console.log(
            "Rule: Temperature exceeded threshold"
          );
        },

        error: (error) => {
          console.error(
            "Graph execution error:",
            error
          );
        }
      });
  }
}

module.exports = {
  CompiledGraph
};
