import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import moment from "moment";

import Log from "./Log";
import "./ProjectLogs.css";
import ProjectForm from "./ProjectForm";
import { useDispatch, useSelector } from "react-redux";
import { getLogs } from "../../store/Actions/logsActions";
import { getProjects } from "../../store/Actions/projectsActions";

function ProjectLogs() {
  const [show, setShow] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const dispatch = useDispatch();
  const { projects } = useSelector(state => state?.project);
  const { logs } = useSelector(state => state?.logs);

  useEffect(() => {
    if (!logs) dispatch(getLogs());
    if (!projects) {
      dispatch(getProjects());
    }
  }, [dispatch, logs, projects]);

  const today = new Date();

  const handleClose = () => {
    setShow(false);
  };
  const handleCloseEdit = () => {
    setSelectedLog(null);
  };
  return (
    <>
      <div className="logs-card">
        <div className="logs-header">
          <h3 className="logs-heading">Project Logs</h3>
          <span className="logs-sub-heading">
            {moment(today).format("dddd, MMMM D, YYYY")}
          </span>
        </div>
        <div className="logs-divider" />
        <div className="logs-div">
          {logs ? (
            logs.map((value, index) => (
              <Log
                key={index}
                title={value?.project?.title}
                description={value.description}
                log={value}
                setSelectedLog={setSelectedLog}
              />
            ))
          ) : (
            <div className="no-logs-div">
              <p className="no-logs-p">No project logs to show!</p>
            </div>
          )}
        </div>
        <div className="logs-create">
          <Button onClick={() => setShow(true)} variant="primary">
            Create
          </Button>
        </div>
      </div>
      <ProjectForm show={show} handleClose={handleClose} />
      <ProjectForm
        edit={selectedLog}
        show={selectedLog}
        handleClose={handleCloseEdit}
      />
    </>
  );
}

export default ProjectLogs;
