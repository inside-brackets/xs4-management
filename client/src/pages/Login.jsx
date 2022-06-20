import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Col, Row, Form, Image, Button, Spinner } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import logo from "../assets/images/logo_login.png";

import Message from "../components/Message";

const Login = () => {
  let history = useHistory();
  let location = useLocation();

  const [loginError, setLoginError] = useState({ status: false, msg: "" });
  const [unAuthorized, setUnAuthorized] = useState({ status: false, msg: "" });
  const [loading, setLoading] = useState(false);

  let { from } = location.state || { from: { pathname: "/" } };

  var loggedInUser = localStorage.getItem("user");
  if (loggedInUser) {
    history.replace(from);
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError({ status: false, msg: "" });
    setUnAuthorized({ status: false, msg: "" });
    setLoading(true);

    // login
  };
  return (
    <>
      <Row className="vh-100 vw-100" style={{ backgroundColor: "#ebf2fa" }}>
        <Col md={6}>
          <FormContainer size="4" title="Login">
            <Form>
              <Row style={{ margin: "10px" }}>
                <Form.Label>Username:</Form.Label>
                <Form.Control type="text" placeholder="username..." />
              </Row>

              <Row style={{ margin: "10px" }}>
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="password"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin(e);
                    }
                  }}
                />
              </Row>
              {loginError.status && (
                <Form.Text style={{ color: "red", margin: "10px" }}>
                  {loginError.msg}
                </Form.Text>
              )}
              <Row style={{ margin: "10px" }} className="mt-4">
                <Button disabled={loading} onClick={handleLogin}>
                  {loading && (
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}{" "}
                  Login{" "}
                </Button>
              </Row>
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
      {unAuthorized.status && (
        <div style={{ position: "absolute", top: "0px", width: "100%" }}>
          <Message>
            <center>{unAuthorized.msg}</center>
          </Message>
        </div>
      )}
    </>
  );
};

export default Login;
