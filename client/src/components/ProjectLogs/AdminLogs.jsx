import React, { useEffect, useState } from "react";
import moment from "moment";

import Log from "./Log";
import "./ProjectLogs.css";
import { useDispatch, useSelector } from "react-redux";
import { getAdminLogs } from "../../store/Actions/logsActions";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { getProjects } from "../../store/Actions/projectsActions";
import { getUsers } from "../../store/Actions/usersAction";
import axios from "axios";
import Select from "react-select";

function AdminLogs() {
  const dispatch = useDispatch();
  const [nUsers, setNUsers] = useState(null);
  const [filter, setFilter] = useState({});
  const { logs, loading: logLoading } = useSelector(state => state?.logs);
  const { users, loading: userLoading } = useSelector(state => state?.user);

  useEffect(() => {
    dispatch(getAdminLogs(makeFilter(filter)));
  }, [dispatch, filter]);

  useEffect(() => {
    const getData = async () => {
      let { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/log/not`
      );
      setNUsers(data);
    };
    getData();
  }, []);

  const today = new Date();
  const { projects, loading } = useSelector(state => state?.project);
  useEffect(() => {
    if (!projects && !loading) {
      dispatch(getProjects());
    }
    if (!users && !userLoading) {
      dispatch(getUsers());
    }
  }, [dispatch, loading, projects, userLoading, users]);

  const renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {nUsers?.map(item => (
        <p>{item.userName}</p>
      ))}
    </Tooltip>
  );

  const filterData = (value, key) => {
    setFilter(oldValue => {
      const temp = { ...oldValue };
      temp[key] = value;
      return temp;
    });
  };

  const makeFilter = filter => {
    let temp = {};

    for (let [key, value] of Object.entries(filter)) {
      if (value instanceof Array) {
        value = value.map(item => item.value ?? item);
      }
      temp[key] = value;
    }
    temp = JSON.stringify(temp);
    return temp;
  };

  return (
    <>
      <div className="logs-card">
        <div className="logs-header">
          <h3 className="logs-heading">Project Logs</h3>
          <div className="logs-sub-heading d-flex align-items-center w-75">
            <Form.Label className="text-capitalize mx-1 mt-1">User</Form.Label>
            <Select
              label={"Users"}
              className="w-50"
              isMulti={true}
              value={filter["user"]}
              onChange={value => {
                filterData(value, "user");
              }}
              options={users?.map(item => ({
                label: item.userName,
                value: item._id
              }))}
              isDisabled={loading}
            />
            <Form.Label className="text-capitalize mx-1 mt-1">
              Project
            </Form.Label>
            <Select
              label={"Projects"}
              isMulti={true}
              className="w-50"
              value={filter["project"]}
              onChange={value => {
                filterData(value, "projects");
              }}
              options={projects?.map(item => ({
                label: item.title,
                value: item._id
              }))}
              isDisabled={loading}
            />

            <span className="mt-2">
              {moment(today).format("dddd, MMMM D, YYYY")}
            </span>
          </div>
        </div>
        <div className="logs-divider" />
        <div className="logs-div">
          {logLoading ? (
            <p>Loading...</p>
          ) : logs && logs?.length === 0 ? (
            <div className="no-logs-div">
              <p className="no-logs-p">No project logs to show!</p>
            </div>
          ) : (
            logs?.map((value, index) => (
              <Log
                key={index}
                title={value?.project?.title}
                description={value.description}
                log={value}
                //  setSelectedLog={setSelectedLog}
                admin
              />
            ))
          )}
        </div>
        <div>
          {" "}
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
          >
            <Button variant="success">
              Hover to See Person who are fill today
            </Button>
          </OverlayTrigger>
        </div>
      </div>
    </>
  );
}

export default AdminLogs;
