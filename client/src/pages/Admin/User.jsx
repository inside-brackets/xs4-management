import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { Row, Col, Button } from "react-bootstrap";

import MyModal from "../../components/modals/MyModal";
import Table from "../../components/table/SmartTable";
import AddUser from "../../components/user/AddUser";

const customerTableHead = [
  "#",
  "Username",
  "Name",
  "Salary",
  "Role",
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

const User = () => {
  const [addUserModal, setAddUserModal] = useState(false);
  const [rerenderTable, setRerenderTable] = useState(null);

  const history = useHistory();

  const renderBody = (item, index, currPage) => (
    <tr key={index}>
      <td>{index + 1 + currPage * 10}</td>
      <td>{item.userName}</td>
      <td>
        {item.firstName && item.lastName
          ? `${item.firstName} ${item.lastName}`
          : "N/A"}
      </td>
      <td>{formatter.format(item.salary)}</td>
      <td>{item.role ?? "NA"}</td>
      <td>
        <div>
          <a
            // className="bx bx-window-open action-button"
            // onClick={() => history.push(`/user/${item._id}`)}
            href={`/users/${item._id}`}
          >
            View
          </a>
        </div>
      </td>
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
