import {
  BaseEdge,
  getBezierPath
} from "@xyflow/react";

function GlowEdge(props) {

  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data
  } = props;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  const active = data?.active === true;

  return (
    <>
      {/* Glow behind the edge */}
      {active && (
        <path
          d={edgePath}
          fill="none"
          stroke="#00ffff"
          strokeWidth="12"
          opacity="0.25"
          className="glow-path"
        />
      )}

      {/* Main edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: active
            ? "#00ffff"
            : "#64748b",

          strokeWidth: active
            ? 3
            : 2,

          strokeDasharray: active
            ? "8 8"
            : "none",

          animation: active
            ? "flowAnimation 0.7s linear infinite"
            : "none"
        }}
      />
    </>
  );
}

export default GlowEdge;