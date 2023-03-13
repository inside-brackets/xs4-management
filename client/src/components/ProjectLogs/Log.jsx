import React from "react";
import ActionButton from "../UI/ActionButton";

function Log({ title, description, log, setSelectedLog }) {
  const colors = ["#1DBF73", "#14A800", "#F20091"];
  return (
    <div className="log-row">
      <div
        className="log-platform"
        style={{ backgroundColor: colors[Math.floor(Math.random() * 3)] }}
      />
      <h3 className="log-title">{title}</h3>
      <div className="log-divider" />
      <div className="log-description-div d-flex">
        <p className="log-description">{description}</p>
        <ActionButton onClick={() => setSelectedLog(log)} type="edit" />
      </div>
    </div>
  );
}

export default Log;
