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
          "Client",
          "Profile",
          "Assignee",
          "Value",
          "Amt. Total",
          "Amt. Received",
          "Emp. Share",
          "Awarded",
          "Deadline",
          "Status",
          "Actions",
        ]
      : [
          "#",
          "Title",
          "Client",
          "Awarded",
          "Deadline",
          "Status",
          "Actions",
        ];
  const renderBody = (item, index, currPage) => (
    <tr key={index}>
      <td>{index + 1 + currPage * PAGE_SIZE}</td>
      <td>{item.title}</td>
      <td>{item.clientName ?? "N/A"}</td>
      {(userInfo.role === "admin" || userInfo.isManager) && (
        <Fragment>
          <td>
          {item.profile.title}({item.profile.platform})
          </td>
          <td>{item.assignee.length === 0 ? "N/A" : item.assignee[0].userName}</td>
          <td>{formatter(item.currency).format(item.projectValue)}</td>
          <td>{formatter(item.currency).format(item.totalAmount??0)}</td>
          <td>{formatter("pkr").format(item.amountRecieved??0)}</td>
          <td>{formatter("pkr").format(item.empShare??0)}</td>
        </Fragment>
      )}
      <td>
        {item.awardedAt ? moment(item.awardedAt).format("DD MMM") : "N/A"}
      </td>
      <td>
        {item.awardedAt ? moment(item.deadlineAt).format("DD MMM") : "N/A"}
      </td>
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
    var project = {
      Title: item.title,
      Profile: item.profile.title,
      Platform: item.profile.platform,
      Assignee: item.assignee.length === 0 ? 'N/A' : item.assignee.map((item) => item.userName).join(', '),
      'Client Name': item.clientName ?? 'N/A',
      'Client Country': item.clientCountry ?? 'N/A',
      'Project Type': item.projectType ?? 'N/A',
      Status: item.status,
      'Awarded At': item.awardedAt ? moment(item.awardedAt).format('DD MMM') : 'N/A',
      'Deadline At': item.awardedAt ? moment(item.deadlineAt).format('DD MMM') : 'N/A',
      'Closed At': item.closedAt ? moment(item.closedAt).format('DD MMM') : 'N/A',
      Recruiter: item.hasRecruiter,
      Description: item.description,
    };
    if (userInfo.role === "admin" || userInfo.isManager){
        project.Currency = item.currency;
        project.Value = formatter(item.currency).format(item.projectValue);
        project['Amount Total'] = formatter(item.currency).format(item.totalAmount ?? 0);
        project['Amount Received'] = formatter('pkr').format(item.amountRecieved ?? 0);
        project['Employee Share'] = formatter('pkr').format(item.empShare ?? 0);
    }
    return project;
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
      Deadline_checkbox: false,
      date_range: "date_range",
      sort: [
        { label: "Awarded At", value: "awardedAt" },
        { label: "Deadline", value: "deadlineAt" },
        { label: "Updated", value: "updatedAt" },
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
      Deadline_checkbox: false,
      date_range: "date_range",
      sort: [
        { label: "Awarded At", value: "awardedAt" },
        { label: "Deadline", value: "deadlineAt" },
        { label: "Updated", value: "updatedAt" },
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
        { label: "Deadline", value: "deadlineAt" },
        { label: "Updated", value: "updatedAt" },
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
