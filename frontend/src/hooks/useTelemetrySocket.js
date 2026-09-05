import { useEffect } from "react";

function useTelemetrySocket({
  onTelemetry,
  onAlert
}) {

  useEffect(() => {

    const socket =
      new WebSocket("ws://localhost:5000");

    socket.onopen = () => {

      console.log(
        "WebSocket connected"
      );

    };

    socket.onmessage = (event) => {

      try {

        const message =
          JSON.parse(event.data);

        console.log(
          "Received:",
          message
        );

        if (
          message.type ===
          "telemetry:stream"
        ) {

          onTelemetry(message);

        }

        if (
          message.type ===
          "rule:alert"
        ) {

          onAlert(message);

        }

      } catch (error) {

        console.error(
          "Invalid WebSocket message",
          error
        );

      }

    };

    socket.onerror = (error) => {

      console.error(
        "WebSocket error:",
        error
      );

    };

    socket.onclose = () => {

      console.log(
        "WebSocket disconnected"
      );

    };

    return () => {

      socket.close();

    };

  }, [onTelemetry, onAlert]);

}

export default useTelemetrySocket;