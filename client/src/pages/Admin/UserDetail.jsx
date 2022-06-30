import axios from "axios";
import React, { useState, useEffect } from "react";
import { Card, Row, Button, Form, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";

import Table from "../../components/table/SmartTable";
import MyModal from "../../components/modals/MyModal";

const customerTableHead = [
  "#",
  "Username",
  "Name",
  "Salary",
  "Role",
  "Actions",
];
const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index, currPage) => (
  <tr key={index}>
    <td>{index + 1 + currPage * 10}</td>
    <td>{item.userName}</td>
    <td>
      {item.firstName && item.lastName
        ? `${item.firstName} ${item.lastName}`
        : "N/A"}
    </td>
    {/* <td>{formatter.format(item.salary)}</td> */}
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

const UserDetail = () => {
  const [editFields, setEditFields] = useState(false);
  const [user, setUser] = useState(null);
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);
  const [rerenderTable, setRerenderTable] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { id } = useParams();

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/${id}`
      );
      setUser(res.data);
    };
    getUser();
  }, [id]);

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };
  const handleSubmit = async () => {
    setLoading(true);
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, state);
    setLoading(false);
  };
  const handleReset = async () => {
    setLoading(false)
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/password/${id}`, {
      password: "12345",
    });
    setLoading(false)
  };

  
  return (
    <Row className="mt-2">
      <Col md={1}>
        <Button>Back</Button>
      </Col>
      <Col md={11}>
        <Row>
      <Card>
        <Card.Title className="text-center">
          <h1>User Detail</h1>
        </Card.Title>
        <Card.Body>
          <Form>
            <Row className="mt-2">
              <Form.Group as={Col} md="4" sm="12">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  name="userName"
                  defaultValue={user?.userName ?? ""}
                  onChange={handleChange}
                  readOnly={!editFields}
                />
              </Form.Group>
              <Form.Group as={Col} md="4" sm="12">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  defaultValue={user?.email ?? ""}
                  onChange={handleChange}
                  readOnly={!editFields}
                />
              </Form.Group>
              <Form.Group as={Col} md="4" sm="12">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  defaultValue={user?.firstName ?? ""}
                  name="firstName"
                  onChange={handleChange}
                  type="text"
                  readOnly={!editFields}
                />
              </Form.Group>
              <Form.Group as={Col} md="4" sm="12">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  name="lastName"
                  defaultValue={user?.lastName ?? ""}
                  onChange={handleChange}
                  type="text"
                  readOnly={!editFields}
                />
              </Form.Group>
              <Form.Group as={Col} md="4" sm="12">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  name="contact"
                  defaultValue={user?.contact ?? ""}
                  onChange={handleChange}
                  type="text"
                  readOnly={!editFields}
                />
              </Form.Group>
              <Form.Group as={Col} md="4" sm="12">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  name="address"
                  defaultValue={user?.address ?? ""}
                  onChange={handleChange}
                  type="text"
                  readOnly={!editFields}
                />
              </Form.Group>
              <Form.Group as={Col} md="4" sm="12">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  name="role"
                  defaultValue={user?.role ?? ""}
                  onChange={handleChange}
                  type="text"
                  readOnly={!editFields}
                />
              </Form.Group>
              <Form.Group as={Col} md="4" sm="12">
                <Form.Label>Salary</Form.Label>
                <Form.Control
                  name="salary"
                  onChange={handleChange}
                  defaultValue={user?.salary ?? ""}
                  type="number"
                  readOnly={!editFields}
                />
              </Form.Group>
              <Col className="text-center">
                <Button className="mt-4" disabled={loading} onClick={handleReset}>
                  <i className="bx bx-reset"></i>
                  Reset Password
                </Button>
              </Col>
            </Row>
            <Row className="my-2">
              <h2>Bank Information</h2>
              <Form.Group as={Col} md="4" sm="12">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control
                  name="bank.name"
                  onChange={handleChange}
                  defaultValue={user?.bank?.name ?? ""}
                  type="text"
                  readOnly={!editFields}
                />
              </Form.Group>
              <Form.Group as={Col} md="4" sm="12">
                <Form.Label>Acc No</Form.Label>
                <Form.Control
                  name="bank.account_no"
                  onChange={handleChange}
                  defaultValue={user?.bank?.account_no ?? ""}
                  type="number"
                  readOnly={!editFields}
                />
              </Form.Group>
              <Form.Group as={Col} md="4" sm="12">
                <Form.Label>Branch Code</Form.Label>
                <Form.Control
                  name="bank.branch_code"
                  onChange={handleChange}
                  defaultValue={user?.bank?.branch_code ?? ""}
                  type="number"
                  readOnly={!editFields}
                />
              </Form.Group>
            </Row>
            <Row className="my-5">
              {!editFields ? (
                <Button as={Col} onClick={() => setEditFields(true)}>
                  Edit
                </Button>
              ) : (
                <>
                  <Button disabled={loading} onClick={handleSubmit} as={Col}>
                    Save
                  </Button>
                  <Button as={Col} onClick={() => setEditFields(false)}>
                    Cancel
                  </Button>
                </>
              )}
            </Row>
          </Form>
        </Card.Body>
      </Card>
      </Row>
      <Row>
        <Col>
        <Button onClick={()=> setShowModal(true)}>Add Profiles</Button>
        </Col>
      </Row>
      <Row>
      <div className="card">
        <div className="card__body">
          <Table
            key={rerenderTable}
            limit={10}
            headData={customerTableHead}
            renderHead={(item, index) => renderHead(item, index)}
            api={{
              url: `${process.env.REACT_APP_BACKEND_URL}/profiles`,
              body: {},
            }}
            filter={{}}
            renderBody={(item, index, currPage) =>
              renderBody(item, index, currPage)
            }
          />
        </div>
      </div>

      </Row>
      </Col>
      <MyModal
        size="lg"
        show={showModal}
        heading="Add Profiles"
        onClose={() => setShowModal(false)}
        style={{ width: "auto" }}
      >
        {/* <AddUser
          setShowModal={() => {
            setAddUserModal(false);
            setRerenderTable(Math.random());
          }}
        /> */}
      </MyModal>
    </Row>
  );
};

export default UserDetail;
