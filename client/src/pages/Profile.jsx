import axios from "axios";
import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import MyModal from "../components/modals/MyModal";

import { toast, ToastContainer } from "react-toastify";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [state, setState] = useState({});
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/users/${userInfo._id}`)
      .then(({ data }) => {
        setState(data);
      });
  }, [userInfo._id]);
  useEffect(() => {
    if (oldPassword) {
      const indentifier = setTimeout(async () => {
        axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/users/token`, {
            userName: state.userName,
            password: oldPassword,
          })
          .then((res) => {
            setPasswordIsValid(true);
            setError(false);
          })
          .catch((err) => setError("Wrong password"));
      }, 500);
      return () => {
        clearTimeout(indentifier);
      };
    }
  }, [oldPassword, state.userName]);

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    if (!oldPassword && !newPassword && !confirmPassword) {
      setError("Please fill all fields");
    } else if (!passwordIsValid) {
      setError("Old Password is not correct");
    } else if (newPassword !== confirmPassword) {
      setError("Confirm Password is not same");
    } else {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/users/password/${userInfo._id}`,
        { password: confirmPassword }
      );
      setConfirmPassword(null);
      setNewPassword(null);
      setOldPassword(null);
      toast.success("Password Updated Successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setShowModal(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === true) {
      if (userInfo) {
        const { password, ...rest } = state;
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userInfo._id}`,
          rest
        );
        toast.success("Profile Updated Successfully!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const closeCloseModel = () => {
    setShowModal(false);
  };
  return (
    <Row>
      <h2>Edit Profile </h2>
      <Col>
        <Card>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="m-3">
              <h3>Personal Info</h3>
              <Form.Group as={Col} md="6">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  aria-describedby="inputGroupPrepend"
                  name="firstName"
                  onChange={handleChange}
                  defaultValue={state?.firstName ?? ""}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  onChange={handleChange}
                  defaultValue={state?.lastName ?? ""}
                  required
                />
              </Form.Group>
            </Row>
            <Row className="m-3"></Row>
            <hr />

            <Row className="m-3">
              <h3>Contact Info</h3>
              <Form.Group as={Col} md="6">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Email"
                  name="email"
                  onChange={handleChange}
                  defaultValue={state?.email ?? ""}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Phone #</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Phone"
                  name="contact"
                  onChange={handleChange}
                  defaultValue={state?.contact ?? ""}
                />
              </Form.Group>

              <Form.Group as={Col} md="6">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  onChange={handleChange}
                  name="address"
                  defaultValue={state?.address ?? ""}
                />
              </Form.Group>

              <Row className="my-2">
                <h2>Bank Information</h2>
                <Form.Group as={Col} md="4" sm="12">
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control
                    name="bank.name"
                    placeholder="Bank Name"
                    onChange={handleChange}
                    defaultValue={state?.bank?.name ?? ""}
                    type="text"
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" sm="12">
                  <Form.Label>Acc No</Form.Label>
                  <Form.Control
                    name="bank.account_no"
                    placeholder="Account Number"
                    onChange={handleChange}
                    defaultValue={state?.bank?.account_no ?? ""}
                    type="number"
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" sm="12">
                  <Form.Label>Branch Code</Form.Label>
                  <Form.Control
                    name="bank.branch_code"
                    onChange={handleChange}
                    placeholder="Branch code"
                    defaultValue={state?.bank?.branch_code ?? ""}
                    type="number"
                  />
                </Form.Group>
              </Row>
              <Row className="justify-content-center mt-5">
                <Col md={3}>
                  <p
                    style={{
                      color: "blue",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowModal(true)}
                  >
                    Change Password
                  </p>
                </Col>
                <MyModal
                  size="md"
                  show={showModal}
                  heading="Change Password"
                  onClose={closeCloseModel}
                  style={{ width: "auto" }}
                >
                  <Row className="justify-content-center">
                    <Row className="mt-3">
                      {error && <Message>{error}</Message>}
                      <Form.Group as={Col}>
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Old Password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid Email.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                    <Row className="mt-3">
                      <Form.Group as={Col}>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid Email.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                    <Row className="mt-3">
                      <Form.Group as={Col}>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid Email.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                  </Row>
                  <Row className="mx-5 mt-3">
                    <Button onClick={passwordChangeHandler}>
                      Change Password
                    </Button>
                  </Row>
                </MyModal>
              </Row>
            </Row>
            <hr />
            <Button type="submit">Edit form</Button>
          </Form>
        </Card>
      </Col>
      <ToastContainer />
    </Row>
  );
};

export default Profile;
