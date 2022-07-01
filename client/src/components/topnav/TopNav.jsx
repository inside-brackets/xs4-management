import React from "react";
import "./topnav.css";
import { Link } from "react-router-dom";
import { Navbar, Container } from "react-bootstrap";

import logo from "../../assets/images/logo_login.png";
import Dropdown from "../dropdown/Dropdown";
import user_image from "../../assets/images/anon_user.png";
import user_menu from "../../assets/JsonData/user_menus.json";

const curr_user = {
  display_name: "user",
  image: user_image,
};

const renderUserToggle = (user) => (
  <div className="topnav__right-user">
    <div className="topnav__right-user__image">
      <img src={user.image} alt="" />
    </div>
    <div className="topnav__right-user__name">{user.display_name}</div>
  </div>
);

const renderUserMenu = (item, index) => (
  <Link to="/" key={index}>
    <div className="notification-item">
      <i className={item.icon}></i>
      <span>{item.content}</span>
    </div>
  </Link>
);

const Topnav = () => {
  return (
    <Navbar bg="dark" variant="light" sticky="top">
      <Container style={{ width: "100vw" }}>
        <Navbar.Brand href="/">
          <img
            alt=""
            src={logo}
            width="35"
            height="35"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Dropdown
          customToggle={() => renderUserToggle(curr_user)}
          contentData={user_menu}
          renderItems={(item, index) => renderUserMenu(item, index)}
        />
      </Container>
    </Navbar>
    // <div className="topnav">
    //   <div className="topnav__right">
    //     <div className="topnav__right-item">
    //       {/* dropdown here */}
    //       <Dropdown
    //         customToggle={() => renderUserToggle(curr_user)}
    //         contentData={user_menu}
    //         renderItems={(item, index) => renderUserMenu(item, index)}
    //       />
    //     </div>
    //   </div>
    // </div>
  );
};

export default Topnav;
