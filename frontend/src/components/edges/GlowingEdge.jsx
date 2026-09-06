import React, { useEffect, useState } from 'react';
import { BaseEdge, getBezierPath } from 'reactflow';

export default function GlowingEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}) {
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    if (data && data.isActive) {
      setIsGlowing(true);
      const timer = setTimeout(() => setIsGlowing(false), 500); // Glow for 500ms
      return () => clearTimeout(timer);
    }
  }, [data?.isActive, data?.activationTime]);

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeStyle = isGlowing
    ? {
        ...style,
        stroke: '#22c55e', // Green glow
        strokeWidth: 4,
        filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))',
        transition: 'all 0.1s ease-in-out',
      }
    : {
        ...style,
        stroke: '#38bdf8', // Default blue stroke
        strokeWidth: 2,
        transition: 'all 0.5s ease-out',
      };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStyle} />
      <path
        d={edgePath}
        fill="none"
        strokeOpacity={0}
        strokeWidth={20}
        className="react-flow__edge-interaction"
      />
    </>
  );
}
