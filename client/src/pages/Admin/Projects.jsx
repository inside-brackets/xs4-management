import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Row, Col, Button, Badge } from "react-bootstrap";

import { useSelector } from "react-redux";

import axios from "axios";

import Table from "../../components/table/SmartTable";

import status_map from "../../assets/JsonData/project_status_map.json";

import moment from "moment";
import { formatter } from "../../util/currencyFormatter";

const renderHead = (item, index) => <th key={index}>{item}</th>;
const PAGE_SIZE = 50;

const Projects = () => {
  const [users, setUsers] = useState(null);
  const [profiles, setProfiles] = useState(null);
  const [bidder, setBidder] = useState(null);
  const { userInfo } = useSelector((state) => state.userLogin);
  const history = useHistory();

  const customerTableHead =
    userInfo.role === "admin" || userInfo.isManager
      ? [
          "#",
          "Title",
          "Profile",
          "Client",
          "Assignee",
          "Value",
          "Awarded",
          "Deadline",
          "Status",
          "Actions",
        ]
      : // : userInfo.isManager
        // ? [
        //     "#",
        //     "Title",
        //     "Client",
        //     "Profile",
        //     "Awarded",
        //     "Deadline",
        //     "Total Amount",
        //     "Employee Share",
        //     "Status",
        //     "Actions",
        //   ]
        [
          "#",
          "Title",
          "Client",

          "Assignee",
          "Awarded",
          "Deadline",
          // "Total Amount",

          "Status",
          "Actions",
        ];
  const renderBody = (item, index, currPage) => (
    <tr key={index}>
      <td>{index + 1 + currPage * PAGE_SIZE}</td>
      <td>{item.title}</td>
      <td>
        {item.profile.title}({item.profile.platform})
      </td>
      <td>{item.clientName ?? "N/A"}</td>

      <td>{item.assignee.length === 0 ? "N/A" : item.assignee[0].userName}</td>
      {(userInfo.role === "admin" || userInfo.isManager) && (
        <Fragment>
          <td>{formatter(item.currency).format(item.projectValue)}</td>
        </Fragment>
      )}
      <td>
        {item.awardedAt ? moment(item.awardedAt).format("DD MMM") : "N/A"}
      </td>
      <td>
        {item.awardedAt ? moment(item.deadlineAt).format("DD MMM") : "N/A"}
      </td>
      {/* {(userInfo.role === "admin" || userInfo.isManager) && (
        <Fragment>
          <td>{formatter(item.currency).format(item.totalAmount)}</td>
        </Fragment>
      )} */}
      <td>
        <h5>
          <Badge bg={status_map[item.status]}>{item.status}</Badge>
        </h5>
      </td>
      <td>
        <Link className="table__row__edit" to={`/projects/project/${item._id}`}>
          <i className="bx bx-edit action-button"></i>
        </Link>
      </td>
    </tr>
  );
  const renderExportData = (item, index, currPage) => {
    return {
      Title: item.title,
      Client_Name: item.clientName ?? "N/A",
      Profile: item.profile.title,
      Platform: item.profile.platform,
      status: item.status,
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
          label: `${profile.title} (${profile.platform})`,
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
      date_range: "closedAt",
      sort: [
        { label: "Awarded At", value: "awardedAt" },
        { label: "Deadline", value: "deadline" },
      ],
    };
  } else if (userInfo.isManager) {
    filter = {
      status: [
        { label: "New", value: "new" },
        { label: "Open", value: "open" },
        { label: "Under Review", value: "underreview" },
        { label: "Closed", value: "closed" },
        { label: "Cancelled", value: "cancelled" },
      ],
      assignment_Single: [
        { label: "All projects", value: "all" },
        { label: "My projects", value: "myprojects" },
        { label: "Assiged to me", value: "assignedtome" },
      ],
      sort: [
        { label: "Awarded At", value: "awardedAt" },
        { label: "Deadline", value: "deadline" },
      ],
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
      sort: [
        { label: "Awarded At", value: "awardedAt" },
        { label: "Deadline", value: "deadline" },
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
            limit={PAGE_SIZE}
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
