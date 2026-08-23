const nodeConfigExtractor = (node) => {

    const data = node.data || {};

    const config = {};

    /*
     * Common React Flow custom inputs
     */

    if (data.threshold !== undefined) {
        config.threshold = Number(data.threshold);
    }

    if (data.windowSize !== undefined) {
        config.windowSize = Number(data.windowSize);
    }

    if (data.duration !== undefined) {
        config.duration = Number(data.duration);
    }

    if (data.message !== undefined) {
        config.message = data.message;
    }

    if (data.sensorId !== undefined) {
        config.sensorId = data.sensorId;
    }

    if (data.topic !== undefined) {
        config.topic = data.topic;
    }

    /*
     * If custom inputs are stored inside data.config
     */

    if (data.config && typeof data.config === "object") {
        Object.assign(config, data.config);
    }

    /*
     * If custom inputs are stored inside
     * data.inputs
     */

    if (Array.isArray(data.inputs)) {

        data.inputs.forEach(input => {

            if (
                input &&
                input.name &&
                input.value !== undefined
            ) {

                config[input.name] = convertValue(
                    input.value
                );
            }

        });
    }

    return config;
};


function convertValue(value) {

    if (value === null || value === undefined) {
        return value;
    }

    if (typeof value !== "string") {
        return value;
    }

    if (value.trim() === "") {
        return value;
    }

    // Boolean
    if (value === "true") {
        return true;
    }

    if (value === "false") {
        return false;
    }

    // Number
    if (!isNaN(value)) {
        return Number(value);
    }

    return value;
}


module.exports = {
    nodeConfigExtractor
};
