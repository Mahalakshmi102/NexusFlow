const {
    nodeConfigExtractor
} = require("../utils/nodeConfigExtractor");

const {
    topologicalSort
} = require("./topologyService");


const parseGraph = (flowJson) => {

    const nodes = flowJson.nodes || [];

    const edges = flowJson.edges || [];


    if (nodes.length === 0) {

        throw new Error(
            "Flow must contain at least one node"
        );
    }


    /*
     * Step 1:
     * Extract node information
     */

    const parsedNodes = nodes.map(node => {

        return {

            id: node.id,

            type: node.type,

            position: node.position || null,

            config: nodeConfigExtractor(node)

        };

    });


    /*
     * Step 2:
     * Topological ordering
     */

    const orderedNodes = topologicalSort(
        parsedNodes,
        edges
    );


    /*
     * Step 3:
     * Add execution order
     */

    const finalNodes = orderedNodes.map(
        (node, index) => {

            return {

                order: index + 1,

                id: node.id,

                type: node.type,

                config: node.config

            };

        }
    );


    return finalNodes;
};


module.exports = {
    parseGraph
};