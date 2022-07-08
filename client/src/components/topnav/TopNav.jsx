import React from "react";
import "./topnav.css";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../../store/Actions/userAction";
import { Navbar, Container, NavDropdown, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../../assets/images/logo.png";

const Topnav = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(Logout());
  };
  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" bg="dark" sticky="top">
      <Container style={{ maxWidth: "100%" }}>
        <LinkContainer to="/">
          <Navbar.Brand
            style={{
              color: "black",
            }}
          >
            <img src={logo} height="30" className="m-1" />
            Xs4 Financial
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            {userInfo && (
              <>
                <NavDropdown
                  title={
                    <span className="mx-2">
                      <i className="bx bx-user px-4"></i>
                      {userInfo.name}
                    </span>
                  }
                  id="basic-nav-dropdown"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Topnav;
