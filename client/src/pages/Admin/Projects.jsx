import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Button, Badge } from "react-bootstrap";

import { useSelector } from "react-redux";

import axios from "axios";

import ActionButton from "../../components/UI/ActionButton";
import Table from "../../components/table/SmartTable";

import status_map from "../../assets/JsonData/project_status_map.json";

const customerTableHead = [
  "#",
  "Title",
  "Profile",
  "Platform",
  "Total Amount",
  "Status",
  "Actions",
];

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "PKR",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const renderHead = (item, index) => <th key={index}>{item}</th>;

const Projects = () => {
  const [users, setUsers] = useState(null);
  const [profiles, setProfiles] = useState(null);

  const { role } = useSelector((state) => state.userLogin.userInfo);

  const history = useHistory();

  const renderBody = (item, index, currPage) => (
    <tr key={index}>
      <td>{index + 1 + currPage * 10}</td>
      <td>{item.title}</td>
      <td>{item.profile.title}</td>
      <td>{item.profile.platform}</td>
      <td>{formatter.format(item.totalAmount)}</td>
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

  var filter = {};

  if (role === "admin") {
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
      bidder: users,
      assignee: users,
      profile: profiles,
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
      .post(`${process.env.REACT_APP_BACKEND_URL}/profiles/1000/0`, {})
      .then((res) => {
        const profileOptions = res.data.data.map((profile) => ({
          label: profile.title,
          value: profile._id,
        }));

        setProfiles(profileOptions);
      });
  }, []);
  return (
    <Row>
      <Row className="m-3">
        <Col md={3}></Col>
        <Col md={5}></Col>
        <Col md={4}>
          <Button
            onClick={() => history.push("/projects/project")}
            style={{ float: "right" }}
          >
            Add Project
          </Button>
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
              body: {},
            }}
            placeholder={"title"}
            filter={filter}
            renderBody={(item, index, currPage) =>
              renderBody(item, index, currPage)
            }
          />
        </div>
      </div>
    </Row>
  );
};

export default Projects;
