const topologicalSort = (nodes, edges) => {

    const nodeMap = new Map();

    const inDegree = new Map();

    const adjacencyList = new Map();


    // Initialize nodes

    nodes.forEach(node => {

        nodeMap.set(node.id, node);

        inDegree.set(node.id, 0);

        adjacencyList.set(node.id, []);

    });


    // Build graph

    edges.forEach(edge => {

        const source = edge.source;
        const target = edge.target;

        if (!nodeMap.has(source)) {
            throw new Error(
                `Source node ${source} does not exist`
            );
        }

        if (!nodeMap.has(target)) {
            throw new Error(
                `Target node ${target} does not exist`
            );
        }

        adjacencyList
            .get(source)
            .push(target);

        inDegree.set(
            target,
            inDegree.get(target) + 1
        );
    });


    // Start with nodes having zero dependencies

    const queue = [];

    for (const [nodeId, degree] of inDegree) {

        if (degree === 0) {
            queue.push(nodeId);
        }
    }


    const sortedNodes = [];


    while (queue.length > 0) {

        const currentNodeId = queue.shift();

        sortedNodes.push(
            nodeMap.get(currentNodeId)
        );


        const neighbours =
            adjacencyList.get(currentNodeId);


        for (const neighbour of neighbours) {

            const newDegree =
                inDegree.get(neighbour) - 1;

            inDegree.set(
                neighbour,
                newDegree
            );


            if (newDegree === 0) {
                queue.push(neighbour);
            }
        }
    }


    // Cycle detection

    if (sortedNodes.length !== nodes.length) {

        throw new Error(
            "Invalid graph: cycle detected. Topological ordering is not possible."
        );
    }


    return sortedNodes;
};


module.exports = {
    topologicalSort
};