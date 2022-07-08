import axios from "axios";
import React, { useState, useEffect } from "react";
import { Card, Row, Button, Form, Col, Spinner } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";

import Table from "../../components/table/SmartTable";
import MyModal from "../../components/modals/MyModal";
import { toast, ToastContainer } from "react-toastify";
import Profiles from "../../components/Profiles";
import ActionButton from "../../components/UI/ActionButton";

const customerTableHead = ["#", "Title", "Paltform", "Share", "actions"];
const renderHead = (item, index) => <th key={index}>{item}</th>;

const UserDetail = () => {
  const [editFields, setEditFields] = useState(false);
  const [user, setUser] = useState(null);
  const [state, setState] = useState({});
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
        <Button onClick={() => history.goBack()}>Back</Button>
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
                <Row className="my-5">
                  {!editFields ? (
                    <Button
                      className="p-2 m-3"
                      variant="outline-primary"
                      as={Col}
                      md={3}
                      onClick={() => setEditFields(true)}
                    >
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button
                        className="p-2 m-3"
                        variant="success"
                        md={3}
                        disabled={loading}
                        onClick={handleSubmit}
                        as={Col}
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
                        className="p-2 m-3"
                        md={3}
                        variant="outline-danger"
                        as={Col}
                        onClick={() => setEditFields(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Row>
        <Row className="mt-3">
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
        heading={`Create Profile For ${user?.userName}`}
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Row>
  );
};

export default UserDetail;
