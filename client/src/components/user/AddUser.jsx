import React, { useState } from "react";
import { Row, Col, Button, Form, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { Register } from "../../store/Actions/userAction";

const AddUser = ({
    setRefresh,
    setShowModal
}) => {
  const [validated, setValidated] = useState(false);
  const [state, setState] = useState({});

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error } = userRegister;

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  console.log(state);

  // useEffect(() => {
  //   if (userName) {
  //     // const indentifier = setTimeout(async () => {
  //     //   if (userName !== defaultValue?.user_name) {
  //     //     const response = await axios.post(
  //     //       `${process.env.REACT_APP_BACKEND_URL}/getusers`,
  //     //       { user_name: userName.replace(/\s+/g, " ").trim().toLowerCase() }
  //     //     );
  //     //     console.log("checking username",response.data);
  //     //     setUsernameIsValid(response.data.length === 0);
  //     //   } else {
  //     //     setUsernameIsValid(true);
  //     //   }
  //     // }, 500);
  //     // return () => {
  //     //   clearTimeout(indentifier);
  //     // };
  //   }
  // }, [userName]);
  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === true) {
      dispatch(Register(state));
      if(!loading && !error){
        setShowModal()
      }
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      {error ? <Alert variant="danger">{error}</Alert> : null}

      <Row className="my-2">
        <Form.Group as={Col} md="6">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            name="userName"
            onChange={handleChange}
            type="text"
            placeholder="Enter username"
          />
          {/* {usernameIsValid && userName && (
            <Form.Text style={{ color: "green" }}>
              Username is available!
            </Form.Text>
          )}
          {usernameIsValid === false && userName && (
            <Form.Text style={{ color: "red" }}>
              Whoops! username already exists.
            </Form.Text>
          )} */}
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
          <h1>Company Info</h1>
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
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />

            <Form.Control.Feedback type="invalid">
              Please provide a valid Email.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
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

      <Button disabled={loading} type="submit">
        Submit form
      </Button>
    </Form>
  );
};

export default AddUser;
