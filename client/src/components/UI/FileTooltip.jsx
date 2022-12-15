import React from "react";
import ReactTooltip from "react-tooltip";
import "./tooltip.css";
const ftooltip = (props) => {
  return (
    <>
      <ReactTooltip
        id={`${props.id}`}
        place="top"
        effect="solid"
        className="tooltips"
        arrowColor="#349EFF"
        style={{ backgroundColor: "#FA1B23 " }}
        offset={{
          top: props.top || 1,
          left: props.left || 0,
          right: props.right || 0,
        }}
      >
        {props.text}
      </ReactTooltip>
    </>
  );
};
export default ftooltip;
