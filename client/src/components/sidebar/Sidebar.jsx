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
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  return (
    <div className="sidebar">
      <center>
        <div className="sidebar__department">PROJECT MANAGEMENT</div>
      </center>
      {sidebar_routes[userInfo.role].map((item, index) => (
        <NavLink activeClassName="active__sidebar" to={item.route} key={index}>
          <SidebarItem title={item.display_name} icon={item.icon} />
        </NavLink>
      ))}
      {userInfo.role === "user" && userInfo.isManager && (
        <NavLink activeClassName="active__sidebar" to="/reports">
          <SidebarItem title="Reports" icon="bx bxs-bar-chart-alt-2" />
        </NavLink>
      )}
      {userInfo.role === "user" && userInfo.handleExpense && (
        <NavLink activeClassName="active__sidebar" to="/expenses">
          <SidebarItem title="Expenses" icon="bx bx-money" />
        </NavLink>
      )}
    </div>
  );
};

export default Sidebar;
