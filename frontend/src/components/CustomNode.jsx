import {
  Handle,
  Position
} from "@xyflow/react";

function CustomNode({ data }) {

  const active =
    data?.active === true;

  return (

    <div
      className={
        active
          ? "custom-node active-node"
          : "custom-node"
      }
    >

      <Handle
        type="target"
        position={Position.Left}
      />

      <div className="node-title">
        {data.label}
      </div>

      {active && (

        <div className="processing">

          ● Processing

        </div>

      )}

      <Handle
        type="source"
        position={Position.Right}
      />

    </div>

  );

}

export default CustomNode;