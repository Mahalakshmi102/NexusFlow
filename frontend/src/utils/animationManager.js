const handleTelemetry =
  useCallback(
    (message) => {

      if (animationFrame.current) {

        cancelAnimationFrame(
          animationFrame.current
        );

      }

      animationFrame.current =
        requestAnimationFrame(() => {

          setEdges(
            currentEdges =>

              currentEdges.map(
                edge => ({

                  ...edge,

                  data: {

                    ...edge.data,

                    active:
                      edge.source ===
                        message.sourceNode &&

                      edge.target ===
                        message.targetNode

                  }

                })
              )
          );


          setNodes(
            currentNodes =>

              currentNodes.map(
                node => {

                  const active =
                    node.id ===
                      message.sourceNode ||

                    node.id ===
                      message.targetNode;

                  return {

                    ...node,

                    data: {

                      ...node.data,

                      active

                    }

                  };

                }
              )

          );

        });

    },
    [setEdges, setNodes]
  );