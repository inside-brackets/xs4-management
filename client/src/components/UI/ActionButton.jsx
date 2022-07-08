import React from "react";
import "./actionbutton.css";

const ActionButton = (props) => {
  return (
    <>
      <span className="table__row__edit" onClick={props.onClick}>
        {props.type === "edit" ? (
          <i className="bx bx-edit action-button"></i>
        ) : props.type === "view" ? (
          <i className="bx bx-file action-button"></i>
        ) : props.type === "open" ? (
          <i className="bx bx-window-open action-button"></i>
        ) : (
          <i className="bx bx-trash-alt action-button"></i>
        )}
      </span>
    </>
  );
};

export default ActionButton;
