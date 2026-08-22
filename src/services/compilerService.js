const {
    of,
    map,
    filter,
    tap
} = require("rxjs");


const compile = (orderedNodes) => {

    if (!Array.isArray(orderedNodes)) {

        throw new Error(
            "Ordered nodes must be an array"
        );
    }


    const operators = [];


    orderedNodes.forEach(node => {

        switch (node.type) {

            case "sensor":

                operators.push({
                    order: node.order,
                    type: "sensor",
                    config: node.config
                });

                break;


            case "movingAverage":

                operators.push({
                    order: node.order,
                    type: "movingAverage",
                    config: node.config
                });

                break;


            case "threshold":

                operators.push({
                    order: node.order,
                    type: "threshold",
                    config: node.config
                });

                break;


            case "smsAlert":

                operators.push({
                    order: node.order,
                    type: "smsAlert",
                    config: node.config
                });

                break;


            default:

                operators.push({
                    order: node.order,
                    type: node.type,
                    config: node.config
                });
        }

    });


    return {
        operators
    };
};


module.exports = {
    compile
};