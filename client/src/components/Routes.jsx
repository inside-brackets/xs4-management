import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import Dashboard from "../pages/Admin/Dashboard";
import UserDashboard from "../pages/User/Dashboard";
import UserScreen from "../pages/Admin/User";
import UserDetailScreen from "../pages/Admin/UserDetail";
import Projects from "../pages/Admin/Projects";
import Project from "../components/project/AddProject";
import Reports from "../pages/Admin/Reports";
import Profile from "../pages/Profile";
import Profiles from "../pages/Admin/Profiles";
import Expense from "../pages/Admin/Expense";
import OtherRevenue from "../pages/Admin/OtherRevenue";

const Routes = () => {
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  return userInfo.role === "admin" ? (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/dashboard" exact component={Dashboard} />
      <Route path="/users" exact component={UserScreen} />
      <Route path="/users/:id" exact component={UserDetailScreen} />
      <Route path="/projects" exact component={Projects} />
      <Route path="/projects/project" exact component={Project} />
      <Route path="/expenses" exact component={Expense} />
      <Route path="/other-revenue" exact component={OtherRevenue} />
      <Route path="/projects/project/:id" exact component={Project} />
      <Route path="/reports" exact component={Reports} />
      <Route path="/profile" component={Profile} />
      <Route path="/profiles" component={Profiles} />
      <Route path="*">
        <h1>Not found</h1>
      </Route>
    </Switch>
  ) : (
    userInfo.role === "user" && (
      <Switch>
        <Route path="/" exact>
          <Redirect to="/dashboard" />
        </Route>
        <Route path="/dashboard" exact component={UserDashboard} />
        <Route path="/projects" exact component={Projects} />
        <Route path="/projects/project" exact component={Project} />
        <Route path="/projects/project/:id" exact component={Project} />
        <Route path="/profile" component={Profile} />
        {userInfo.isManager && (
          <Route path="/reports" exact component={Reports} />
        )}
        <Route path="*">
          <h1>Not found</h1>
        </Route>
      </Switch>
    )
  );
};

export default Routes;
