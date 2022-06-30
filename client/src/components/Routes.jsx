import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import Dashboard from "../pages/Admin/Dashboard";
import UserScreen from "../pages/Admin/User";
import UserDetailScreen from "../pages/Admin/UserDetail";

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
      <Route path="*">
        <h1>Not found</h1>
      </Route>
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
