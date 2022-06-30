import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import "./sidebar.css";
import sidebar_routes from "../../assets/JsonData/sidebar_routes.json";

const SidebarItem = (props) => {
  const active = props.active ? "active" : "";

  return (
    <div className="sidebar__item">
      <div className={`sidebar__item-inner ${active}`}>
        <i className={props.icon}></i>
        <span>{props.title}</span>
      </div>
    </div>
  );
};

const Sidebar = (props) => {
  const { role } = useSelector((state) => state.userLogin.userInfo);

  return (
    <div className="sidebar">
      <center>
        <div className="sidebar__department">MANAGEMENT PORTAL</div>
      </center>
      {sidebar_routes[role].map((item, index) => (
        <NavLink activeClassName="active__sidebar" to={item.route} key={index}>
          <SidebarItem title={item.display_name} icon={item.icon} />
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
