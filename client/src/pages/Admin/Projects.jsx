import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Button, Badge } from "react-bootstrap";

import { useSelector } from "react-redux";

import axios from "axios";

import ActionButton from "../../components/UI/ActionButton";
import Table from "../../components/table/SmartTable";

import status_map from "../../assets/JsonData/project_status_map.json";

import moment from "moment";
import { formatter } from "../../util/currencyFormatter";

const renderHead = (item, index) => <th key={index}>{item}</th>;

const Projects = () => {
  const [users, setUsers] = useState(null);
  const [profiles, setProfiles] = useState(null);
  const [bidder, setBidder] = useState(null);
  const { userInfo } = useSelector((state) => state.userLogin);

  const history = useHistory();

  const customerTableHead =
    userInfo.role === "admin"
      ? [
          "#",
          "Title",
          "Client",
          "Profile",
          "Awarded",
          "Deadline",
          "Total Amount",
          "Employee Share",
          "Status",
          "Actions",
        ]
      : [
          "#",
          "Title",
          "Client",
          "Profile",
          "Awarded",
          "Deadline",
          "Status",
          "Actions",
        ];

  const renderBody = (item, index, currPage) => (
    <tr key={index}>
      <td>{index + 1 + currPage * 10}</td>
      <td>{item.title}</td>
      <td>{item.clientName ?? "N/A"}</td>
      <td>
        {item.profile.title} ({item.profile.platform})
      </td>
      <td>
        {item.awardedAt ? moment(item.awardedAt).format("DD MMM") : "N/A"}
      </td>
      <td>
        {item.awardedAt ? moment(item.deadlineAt).format("DD MMM") : "N/A"}
      </td>
      {userInfo.role === "admin" && (
        <Fragment>
          <td>{formatter(item.currency).format(item.totalAmount)}</td>
          <td>
            {item.empShare ? formatter("PKR").format(item.empShare) : "N/A"}
          </td>
        </Fragment>
      )}
      <td>
        <h5>
          <Badge bg={status_map[item.status]}>{item.status}</Badge>
        </h5>
      </td>
      <td>
        <ActionButton
          onClick={() => history.push(`/projects/project/${item._id}`)}
          type="edit"
        />
      </td>
    </tr>
  );
  const renderExportData = (item, index, currPage) => {
    return {
      Title: item.title,
      Client_Name: item.clientName ?? "N/A",
      Profile: item.profile.title,
      Platform: item.profile.platform,
      status:item.status,
      AwardedAt: item.awardedAt
        ? moment(item.awardedAt).format("DD MMM")
        : "N/A",
      DeadlineAt: item.awardedAt
        ? moment(item.deadlineAt).format("DD MMM")
        : "N/A",
      totalAmount:
        userInfo.role === "admin" &&
        formatter(item.currency).format(item.totalAmount),
    };
  };

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/users/1000/0`, {})
      .then((res) => {
        const userOptions = res.data.data.map((user) => ({
          label: user.userName,
          value: user._id,
        }));

        setUsers(userOptions);
      });
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/users/1000/0`, {
        isManager: true,
      })
      .then((res) => {
        const userOptions = res.data.data.map((user) => ({
          label: user.userName,
          value: user._id,
        }));

        setBidder(userOptions);
      });
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/profiles/1000/0`, {})
      .then((res) => {
        const profileOptions = res.data.data.map((profile) => ({
          label: profile.title,
          value: profile._id,
        }));

        setProfiles(profileOptions);
      });
  }, []);

  var filter = {};
  var body = {};

  if (userInfo.role === "admin") {
    filter = {
      status: [
        { label: "New", value: "new" },
        { label: "Open", value: "open" },
        { label: "Under Review", value: "underreview" },
        { label: "Closed", value: "closed" },
        { label: "Cancelled", value: "cancelled" },
      ],
      platform: [
        { label: "Freelancer", value: "freelancer" },
        { label: "Upwork", value: "upwork" },
        { label: "Fiver", value: "fiver" },
      ],
      bidder: bidder,
      assignee: users,
      profile: profiles,
      date_range:"closedAt",
    };
  } else {
    filter = {
      status: [
        { label: "New", value: "new" },
        { label: "Open", value: "open" },
        { label: "Under Review", value: "underreview" },
        { label: "Closed", value: "closed" },
        { label: "Cancelled", value: "cancelled" },
      ],
    };
  }

  return (
    <Row>
      <Row className="m-3">
        <Col md={3}></Col>
        <Col md={5}></Col>
        <Col md={4}>
          {userInfo.isManager || userInfo.role === "admin" ? (
            <Button
              onClick={() => history.push("/projects/project")}
              style={{ float: "right" }}
            >
              Add Project
            </Button>
          ) : (
            <></>
          )}{" "}
        </Col>
      </Row>
      <div className="card">
        <div className="card__body">
          <Table
            title="Projects"
            limit={10}
            headData={customerTableHead}
            renderHead={(item, index) => renderHead(item, index)}
            api={{
              url: `${process.env.REACT_APP_BACKEND_URL}/projects`,
              body,
            }}
            placeholder={"title | client name"}
            filter={filter}
            renderBody={(item, index, currPage) =>
              renderBody(item, index, currPage)
            }
            renderExportData={(data) => renderExportData(data)}
            exportData
          />
        </div>
      </div>
    </Row>
  );
};

export default Projects;
