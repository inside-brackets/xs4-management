import React from "react";
import "./layout.css";

import Sidebar from "../sidebar/Sidebar";

import TopNav from "../topnav/TopNav";
import Routes from "../Routes";
import { Route } from "react-router-dom";

const Layout = () => {
  return (
    <Route
      render={(props) => (
        <div className={`layout`}>
          <Sidebar {...props} />
          <TopNav />

          <div className="layout__content">
            <div className="layout__content-main">
              <Routes />
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default Layout;
