function evaluateRule(value, operator, threshold) {
  switch (operator) {
    case ">":
      return value > threshold;

    case "<":
      return value < threshold;

    case ">=":
      return value >= threshold;

    case "<=":
      return value <= threshold;

    case "===":
    case "==":
      return value === threshold;

    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

function evaluateNodeRule(node, telemetry) {
  const field = node.data.field;
  const operator = node.data.operator;
  const threshold = Number(node.data.threshold);

  const value = telemetry[field];

  if (value === undefined) {
    console.log(`Field ${field} not found in telemetry`);

    return false;
  }

  const result = evaluateRule(
    Number(value),
    operator,
    threshold
  );

  console.log(
    `Rule Evaluation: ${field} ${operator} ${threshold}`
  );

  console.log(
    `Actual Value: ${value}`
  );

  console.log(
    `Result: ${result}`
  );

  return result;
}

module.exports = {
  evaluateRule,
  evaluateNodeRule
};
