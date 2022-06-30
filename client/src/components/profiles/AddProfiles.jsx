import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { Register } from "../../store/Actions/userAction";

const AddUser = ({ setShowModal }) => {
  const [validated, setValidated] = useState(false);
  const [state, setState] = useState({});
  const [usernameIsValid, setUsernameIsValid] = useState(null);

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error } = userRegister;

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  useEffect(() => {
    if (state.userName) {
      const indentifier = setTimeout(async () => {
        let userName = state.userName.replace(/\s+/g, " ").trim().toLowerCase();
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/users/10/0`,
          { search: userName }
        );
        setUsernameIsValid(response.data.length === 0);
      }, 500);
      return () => {
        clearTimeout(indentifier);
      };
    }
  }, [state.userName]);

  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === true) {
      dispatch(Register(state));
      if (!loading && !error) {
        setShowModal();
      }
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      {/* {error ? <Alert variant="danger">{error}</Alert> : null} */}

      <Row className="my-2">
        <Form.Group as={Col} md="6">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            className={`${
              state.userName && !usernameIsValid ? "invalid is-invalid" : ""
            } no__feedback shadow-none`}
            name="userName"
            onChange={handleChange}
            type="text"
            placeholder="Enter username"
            required
          />
          {usernameIsValid && state.userName && (
            <Form.Text style={{ color: "green" }}>
              Username is available!
            </Form.Text>
          )}
          {usernameIsValid === false && state.userName && (
            <Form.Text style={{ color: "red" }}>
              Whoops! username already exists.
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group as={Col} md="6">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="my-3">
        <Row>
          {/* {!defaultValue && <hr />} */}
          {/* <h1>Company Info</h1> */}
          <Form.Group as={Col} md="6">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              name="role"
              onChange={handleChange}
              required
            >
              <option value={null}></option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </Form.Control>

            <Form.Control.Feedback type="invalid">
              Please provide a valid Role.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Basic Salary</Form.Label>
            <Form.Control
              type="number"
              placeholder="Salary"
              name="salary"
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Salary.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
      </Row>

      <Button
        disabled={
          loading ||
          !usernameIsValid ||
          !state.role ||
          !state.salary ||
          !state.password ||
          !state.userName
        }
        type="submit"
      >
        Submit
      </Button>
    </Form>
  );
};

export default AddUser;
