

function parseGraph(nodes, edges) {


    const nodeMap = new Map();

    nodes.forEach(node => {
        nodeMap.set(node.id, node);
    });



    const outgoing = new Map();
    const incoming = new Map();

    nodes.forEach(node => {
        outgoing.set(node.id, []);
        incoming.set(node.id, []);
    });

    edges.forEach(edge => {

        const source = edge.source;
        const target = edge.target;

        // Make sure both nodes exist
        if (!nodeMap.has(source)) {
            throw new Error(
                `Source node '${source}' does not exist`
            );
        }

        if (!nodeMap.has(target)) {
            throw new Error(
                `Target node '${target}' does not exist`
            );
        }


        // Source → Target
        outgoing.get(source).push(target);

        // Target ← Source
        incoming.get(target).push(source);

    });

    const inDegree = new Map();

    nodes.forEach(node => {

        inDegree.set(
            node.id,
            incoming.get(node.id).length
        );

    });

    const queue = [];

    inDegree.forEach((degree, nodeId) => {

        if (degree === 0) {
            queue.push(nodeId);
        }

    });


    const executionOrder = [];

    while (queue.length > 0) {

        // Remove first node
        const currentNode = queue.shift();

        // Add to execution order
        executionOrder.push(currentNode);


        // Find nodes connected from current node
        const nextNodes =
            outgoing.get(currentNode) || [];


        nextNodes.forEach(nextNode => {

            // Remove one incoming connection
            const newDegree =
                inDegree.get(nextNode) - 1;

            inDegree.set(
                nextNode,
                newDegree
            );


            // If no more incoming connections,
            // this node is ready to execute
            if (newDegree === 0) {

                queue.push(nextNode);

            }

        });

    }


    

    if (executionOrder.length !== nodes.length) {

        throw new Error(
            "Graph contains a cycle. " +
            "Topological execution order cannot be determined."
        );

    }


    const topologicalMap = {};

    executionOrder.forEach((nodeId, index) => {

        topologicalMap[nodeId] = {
            order: index + 1,
            node: nodeMap.get(nodeId),
            incoming: incoming.get(nodeId),
            outgoing: outgoing.get(nodeId)
        };

    });

    return {
        executionOrder,
        topologicalMap,
        connections: {
            incoming: Object.fromEntries(incoming),
            outgoing: Object.fromEntries(outgoing)
        }
    };
}


module.exports = {
    parseGraph
};