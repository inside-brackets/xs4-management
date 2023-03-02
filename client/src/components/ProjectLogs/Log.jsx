import React from "react";

function Log({ title, platform, description }) {
  const colors = {
    fiver: "#1DBF73",
    upwork: "#14A800",
    freelancer: "#F20091",
  };
  return (
    <div className="log-row">
      <div
        className="log-platform"
        style={{ backgroundColor: colors[platform] }}
      />
      <h3 className="log-title">{title}</h3>
      <div className="log-divider" />
      <div className="log-description-div">
        <p className="log-description">{description}</p>
      </div>
    </div>
  );
}

export default Log;
