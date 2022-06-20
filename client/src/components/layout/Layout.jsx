import React from "react";
import "./layout.css";
import TopNav from "../topnav/TopNav";
import Routes from "../Routes";
import { Route } from "react-router-dom";

const Layout = () => {
  return (
    <Route
      render={(props) => (
        <div className={`layout`}>
          <div className="layout__content">
            <TopNav />
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
