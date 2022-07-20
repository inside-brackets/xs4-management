import axios from "axios";
import React, { useState, useEffect } from "react";
import { Card, Row, Button, Form, Col, Spinner } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";

import Table from "../../components/table/SmartTable";
import MyModal from "../../components/modals/MyModal";
import { toast } from "react-toastify";
import Profiles from "../../components/Profiles";
import ActionButton from "../../components/UI/ActionButton";
import BackButton from "../../components/UI/BackButton";

const customerTableHead = ["#", "Title", "Paltform", "Share", "actions"];
const renderHead = (item, index) => <th key={index}>{item}</th>;

const UserDetail = () => {
  const [editFields, setEditFields] = useState(false);
  const [user, setUser] = useState(null);
  const [state, setState] = useState({ isManager: false });
  const [loading, setLoading] = useState(false);
  const [rerenderTable, setRerenderTable] = useState(null);
  const [defaultValue, setDefaultValue] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { id } = useParams();
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
    const getUser = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/${id}`
      );
      setUser(res.data);
      setState((prev) => {
        return {
          ...prev,
          isManager: res.data.isManager,
        };
      });
    };
    getUser();
  }, [id]);

  const handleChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;
    if (name === "isManager") {
      setState((prev) => {
        return {
          ...prev,
          isManager: !state.isManager,
        };
      });
    } else {
      setState({
        ...state,
        [name]: value,
      });
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/users/${id}`,
      state
    );
    if (res.status === 200) toast.success("User Edit Sucessfully");
    setLoading(false);
    setEditFields(false);
  };
  const handleReset = async () => {
    setLoading(true);
    const newPass = "12345";
    await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/users/password/${id}`,
      {
        password: newPass,
      }
    );
    toast.success(`Password set to: ${newPass}`);
    setLoading(false);
  };

  return (
    <Row className="mt-2">
      <Col md={1}>
        <BackButton onClick={() => history.goBack()} />
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
                      readOnly
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="4" sm="12">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      defaultValue={user?.firstName ?? ""}
                      name="firstName"
                      onChange={handleChange}
                      type="text"
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4" sm="12">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      name="lastName"
                      defaultValue={user?.lastName ?? ""}
                      onChange={handleChange}
                      type="text"
                      readOnly
                    />
                  </Form.Group>
                </Row>
                <Row className="mt-2">
                  <Form.Group as={Col} md="4" sm="12">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      defaultValue={user?.email ?? ""}
                      onChange={handleChange}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4" sm="12">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control
                      name="contact"
                      defaultValue={user?.contact ?? ""}
                      onChange={handleChange}
                      type="text"
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4" sm="12">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      name="address"
                      defaultValue={user?.address ?? ""}
                      onChange={handleChange}
                      type="text"
                      readOnly
                    />
                  </Form.Group>
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
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4" sm="12">
                    <Form.Label>Acc No</Form.Label>
                    <Form.Control
                      name="bank.account_no"
                      onChange={handleChange}
                      defaultValue={user?.bank?.account_no ?? ""}
                      type="number"
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4" sm="12">
                    <Form.Label>Branch Code</Form.Label>
                    <Form.Control
                      name="bank.branch_code"
                      onChange={handleChange}
                      defaultValue={user?.bank?.branch_code ?? ""}
                      type="number"
                      readOnly
                    />
                  </Form.Group>
                </Row>
                <hr />
                <Row className="mt-2">
                  <Form.Group as={Col} md="4" sm="12">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="role"
                      onChange={handleChange}
                      defaultValue={user?.role ?? ""}
                      disabled={!editFields}
                      required
                    >
                      <option value={null}>Select-Role</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </Form.Select>
                  </Form.Group>
                  {user?.role === "user" && (
                    <Form.Group className="mt-4" as={Col} md="2">
                      <Form.Check
                        type="checkbox"
                        name="isManager"
                        checked={state.isManager ?? false}
                        label={`Is Manager`}
                        disabled={!editFields}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  )}
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
                    <Button
                      className="mt-4"
                      disabled={loading}
                      onClick={handleReset}
                    >
                      <i className="bx bx-reset"></i>
                      {loading && (
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                      Reset Password
                    </Button>
                  </Col>
                </Row>
                <hr />
                {!editFields ? (
                  <Button
                    className="p-2"
                    variant="outline-primary"
                    md={3}
                    onClick={() => setEditFields(true)}
                  >
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      className="p-2"
                      variant="success"
                      md={3}
                      disabled={loading}
                      onClick={handleSubmit}
                    >
                      {loading && (
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                      Save
                    </Button>
                    <Button
                      className="p-2"
                      md={3}
                      style={{ marginLeft: "10px" }}
                      variant="outline-danger"
                      onClick={() => setEditFields(false)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Row>
        <Row className="mt-3 mb-2">
          <Col>
            <Button
              onClick={() => {
                setDefaultValue(null);
                setShowModal(true);
              }}
            >
              Add Profiles
            </Button>
          </Col>
        </Row>
        <Row>
          <div className="card">
            <div className="card__body">
              <Table
                key={rerenderTable}
                limit={10}
                title="Profiles"
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                api={{
                  url: `${process.env.REACT_APP_BACKEND_URL}/profiles`,
                  body: { bidder: id },
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
        heading={`${defaultValue ? "Edit" : "Create"} Profile For ${
          user?.userName
        }`}
        onClose={() => setShowModal(false)}
        style={{ width: "auto" }}
      >
        <Profiles
          defaultValue={defaultValue}
          user={user}
          onSuccess={() => {
            setRerenderTable(Math.random());
            setShowModal(false);
          }}
        />
      </MyModal>
      {/* <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
    </Row>
  );
};

export default UserDetail;
