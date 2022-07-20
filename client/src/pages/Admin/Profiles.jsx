import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";

import { useSelector } from "react-redux";

import axios from "axios";

import ActionButton from "../../components/UI/ActionButton";
import Table from "../../components/table/SmartTable";
import MyModal from "../../components/modals/MyModal";
import ProfileEdit from '../../components/Profiles'

const customerTableHead = ["#", "Title", "Paltform", "Share", "actions"];
const renderHead = (item, index) => <th key={index}>{item}</th>;
const Profiles = () => {
  const [bidder, setBidder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [defaultValue, setDefaultValue] = useState(null)
  const [rerenderTable, setRerenderTable] = useState(null)
  const { userInfo } = useSelector((state) => state.userLogin);

  const history = useHistory();

  const renderBody = (item, index, currPage) => (
    <tr key={index}>
      <td>{index + 1 + currPage * 10}</td>
      <td>{item.title}</td>
      {/* <td>{formatter.format(item.salary)}</td> */}
      <td>{item.platform ?? "NA"}</td>
      <td>{item.share ?? "NA"}</td>
      <td>
        <ActionButton
          type="edit"
          onClick={() => {
            setDefaultValue(item);
            setShowModal(true);
          }}
        />
      </td>
    </tr>
  );



  useEffect(() => {
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
      }, []);

  var filter = {};
  var body = {};

  if (userInfo.role === "admin") {
    filter = {
      platform: [
        { label: "Freelancer", value: "freelancer" },
        { label: "Upwork", value: "upwork" },
        { label: "Fiver", value: "fiver" },
      ],
      bidder: bidder,
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
          key={rerenderTable}
            title="Profiles"
            limit={10}
            headData={customerTableHead}
            renderHead={(item, index) => renderHead(item, index)}
            api={{
              url: `${process.env.REACT_APP_BACKEND_URL}/profiles`,
              body,
            }}
            placeholder={"title"}
            filter={filter}
            renderBody={(item, index, currPage) =>
              renderBody(item, index, currPage)
            }
          />
        </div>
      </div>
      <MyModal
        size="lg"
        show={showModal}
        heading={`${defaultValue ? "Edit" : "Create"} Profile For ${
          defaultValue?.userName
        }`}
        onClose={() => setShowModal(false)}
        style={{ width: "auto" }}
      >
        <ProfileEdit
          defaultValue={defaultValue}
          onSuccess={() => {
            setRerenderTable(Math.random());
            setShowModal(false);
          }}
        />
      </MyModal>
    </Row>
  );
};

export default Profiles;
