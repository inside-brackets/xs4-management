import React, { useState, useEffect } from "react";
import { Col, Row, Form, Image, Button, Spinner as Loader } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";

import FormContainer from "../components/FormContainer";
import logo from "../assets/images/logo_login.png";
import Message from "../components/Message";
import { Login } from "../store/Actions/userAction";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const redirect = query.get("redirect") === null ? "/" : query.get("redirect");
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      console.log(redirect);
      if (redirect === "admin") {
        if (userInfo.isAdmin) {
          history.push(redirect);
        }
      } else {
        history.push(redirect);
      }
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch login
    dispatch(Login(email, password));
  };
  return (
    <>
      <Row className="vh-100 vw-100" style={{ backgroundColor: "#ebf2fa" }}>
        <Col md={6}>
          <FormContainer size="4" title="Login">
            {error ? <Message variant="danger">{error}</Message> : null}
            {loading ? <Loader /> : null}
            <Form onSubmit={submitHandler}>
              <Form.Group>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <div className="d-grid">
                <Button type="submit" className="btn btn-primary mt-3">
                  Sign In
                </Button>
              </div>
            </Form>
          </FormContainer>
        </Col>
        <Col md={6}>
          <Image
            className="justify-content-start align-items-center vh-100 vw-100"
            src={logo}
            fluid
          />
        </Col>
      </Row>
    </>
  );
};

export default LoginPage;
