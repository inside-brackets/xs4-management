import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import Dashboard from "../pages/Admin/Dashboard";
import UserScreen from "../pages/Admin/User";
import UserDetailScreen from "../pages/Admin/UserDetail";
import Projects from "../pages/Admin/Projects";
import Project from "../components/project/AddProject";

const Routes = () => {
  const { role } = useSelector((state) => state.userLogin.userInfo);
  return role === "admin" ? (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/dashboard" exact component={Dashboard} />
      <Route path="/users" exact component={UserScreen} />
      <Route path="/users/:id" exact component={UserDetailScreen} />
      <Route path="/projects" exact component={Projects} />
      <Route path="/projects/project" exact component={Project} />
      <Route path="*">
        <h1>Not found</h1>
      </Route>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Switch>
  ) : (
    role === "user" && (
      <Switch>
        <Route path="/" exact>
          <Redirect to="/dashboard" />
        </Route>
        <Route path="*">
          <h1>Not found</h1>
        </Route>

      </Switch>
    )
  );
};

export default Routes;
