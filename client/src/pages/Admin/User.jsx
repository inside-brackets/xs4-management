import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";

import MyModal from "../../components/modals/MyModal";
import Table from "../../components/table/SmartTable";
import AddUser from "../../components/user/AddUser";
import ActionButton from "../../components/UI/ActionButton";
import { formatter } from "../../util/currencyFormatter";

const customerTableHead = [
  "#",
  "Username",
  "Name",
  "Salary",
  "Role",
  "Actions",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const PAGE_SIZE = 50;

const User = () => {
  const [addUserModal, setAddUserModal] = useState(false);
  const [rerenderTable, setRerenderTable] = useState(null);

  const history = useHistory();

  const renderBody = (item, index, currPage) => (
    <tr key={index}>
      <td>{index + 1 + currPage * PAGE_SIZE}</td>
      <td>{item.userName}</td>
      <td>
        {item.firstName && item.lastName
          ? `${item.firstName} ${item.lastName}`
          : "N/A"}
      </td>
      <td>{formatter("PKR").format(item.salary)}</td>
      <td>{item.role ?? "NA"}</td>
      <td>
        <div>
          <ActionButton
            type="open"
            onClick={() => history.push(`/users/${item._id}`)}
          />
        </div>
      </td>
    </tr>
  );

  const renderExportData = (item, index, currPage) => {
    return {
      Name: item.userName,

      fullName:
        item.firstName && item.lastName
          ? `${item.firstName} ${item.lastName}`
          : "N/A",
      salary: formatter("PKR").format(item.salary),
      role: item.role ?? "NA",
    };
  };

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
            title="Users"
            limit={PAGE_SIZE}
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
            renderExportData={(data) => renderExportData(data)}
            exportData
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
            setRerenderTable(Math.random());
            setAddUserModal(false);
          }}
        />
      </MyModal>
    </Row>
  );
};

export default User;
