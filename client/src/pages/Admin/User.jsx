import React, { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import MyModal from "../../components/modals/MyModal";

import Table from "../../components/table/SmartTable";
import AddUser from "../../components/user/AddUser";
const customerTableHead = ["#", "First Name", "Last Name", "Bank", "role", ""];
const renderHead = (item, index) => <th key={index}>{item}</th>;

const User = () => {
  const [addUserModal, setAddUserModal] = useState(false);
  const [rerenderTable, setRerenderTable] = useState(null);

  const renderBody = (item, index, currPage) => (
    <tr key={index}>
      <td>{index + 1 + currPage * 10}</td>
      <td>{item.user_name ?? "NA"}</td>
      <td>{item.weight ? item.weight : "NA"}</td>
      <td>{item.bank ? item.bank.name : "NA"}</td>
      <td>{item.role ?? "NA"}</td>
    </tr>
  );

  return (
    <Row>
      <Row className="m-3">
        <Col md={3}></Col>
        <Col md={5}></Col>
        <Col md={4}>
          <Button
            onClick={() => setAddUserModal(true)}
            style={{ float: "right" }}
          >
            Add User
          </Button>
        </Col>
      </Row>
      <div className="card">
        <div className="card__body">
          <Table
            key={rerenderTable}
            limit={10}
            headData={customerTableHead}
            renderHead={(item, index) => renderHead(item, index)}
            api={{
              url: `${process.env.REACT_APP_BACKEND_URL}/users`,
              body: {},
            }}
            placeholder={"User Name"}
            filter={{
              role: [
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
              ],
            }}
            renderBody={(item, index, currPage) =>
              renderBody(item, index, currPage)
            }
          />
        </div>
      </div>
      <MyModal
        size="lg"
        show={addUserModal}
        heading="Add User"
        onClose={() => setAddUserModal(false)}
        style={{ width: "auto" }}
      >
        <AddUser
          setShowModal={() => {
            setAddUserModal(false);
            setRerenderTable(Math.random());
          }}
        />
      </MyModal>
    </Row>
  );
};

export default User;
