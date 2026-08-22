function validateGraph(nodes, edges) {
    const errors = [];

    if (!Array.isArray(nodes)) {
        errors.push("nodes must be an array");
    }

    if (!Array.isArray(edges)) {
        errors.push("edges must be an array");
    }

    if (Array.isArray(nodes)) {
        nodes.forEach((node, index) => {
            if (!node.id) {
                errors.push(`Node at index ${index} is missing an id`);
            }
        });
    }

    if (Array.isArray(edges)) {
        edges.forEach((edge, index) => {
            if (!edge.source) {
                errors.push(`Edge at index ${index} is missing source`);
            }

            if (!edge.target) {
                errors.push(`Edge at index ${index} is missing target`);
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = {
    validateGraph
};
