import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { Register } from "../../store/Actions/userAction";

const AddUser = ({ setShowModal }) => {
  const [validated, setValidated] = useState(false);
  const [state, setState] = useState({ isManager: false });
  const [usernameIsValid, setUsernameIsValid] = useState(null);
  const { loading } = useSelector((state) => state.userRegister);

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

  useEffect(() => {
    if (state.userName) {
      const indentifier = setTimeout(async () => {
        let userName = state.userName
          .replaceAll(/\s+/g, " ")
          .trim()
          .toLowerCase();
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/users/byusername/${userName}`
        );

        setUsernameIsValid(response.data);
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
      setTimeout(() => {
        setShowModal();
      }, 2000);
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
        <Form.Group as={Col} md="4">
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

        <Form.Group as={Col} md="4">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            name="role"
            onChange={handleChange}
            required
          >
            <option value={null}>Select-Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </Form.Control>

          <Form.Control.Feedback type="invalid">
            Please provide a valid Role.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="4">
          <Form.Label>Department</Form.Label>
          <Form.Control
            as="select"
            name="department"
            onChange={handleChange}
            required
          >
            <option value={null}>Select-Department</option>
            <option value="accounts">Accounts</option>
            <option value="graphics">Graphics</option>
          </Form.Control>

          <Form.Control.Feedback type="invalid">
            Please provide a valid Role.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-4" as={Col} md="2">
          <Form.Check
            type="checkbox"
            name="isManager"
            checked={state.isManager ?? false}
            label={`Is Manager`}
            onChange={handleChange}
          />
        </Form.Group>
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
