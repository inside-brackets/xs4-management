import React from "react";
import { Button } from "react-bootstrap";
import moment from "moment";

import Log from "./Log";
import "./ProjectLogs.css";

function ProjectLogs() {
  const today = new Date();
  const logs = [
    {
      title: "Project 1",
      platform: "fiver",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at neque turpis. Cras ultrices massa vel arcu suscipit, id pulvinar ex venenatis. Duis tempus lectus nulla, non tincidunt massa commodo in.",
    },
    {
      title: "Project 3",
      platform: "upwork",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at neque turpis. Cras ultrices massa vel arcu suscipit, id pulvinar ex venenatis. Duis tempus lectus nulla, non tincidunt massa commodo in.",
    },
    {
      title: "Project 2",
      platform: "freelancer",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at neque turpis. Cras ultrices massa vel arcu suscipit, id pulvinar ex venenatis. Duis tempus lectus nulla, non tincidunt massa commodo in.",
    },
  ];
  return (
    <div className="logs-card">
      <div className="logs-header">
        <h3 className="logs-heading">Project Logs</h3>
        <span className="logs-sub-heading">
          {moment(today).format("dddd, MMMM D, YYYY")}
        </span>
      </div>
      <div className="logs-divider" />
      <div className="logs-div">
        {logs.length > 0 ? (
          logs.map((value, index) => (
            <Log
              key={index}
              title={value.title}
              platform={value.platform}
              description={value.description}
            />
          ))
        ) : (
          <div className="no-logs-div">
            <p className="no-logs-p">No project logs to show!</p>
          </div>
        )}
      </div>
      <div className="logs-create">
        <Button variant="primary">Create</Button>
      </div>
    </div>
  );
}

export default ProjectLogs;
