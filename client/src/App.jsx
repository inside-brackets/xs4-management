import React from "react";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <>
      <Switch>
        {/* public routes go here */}
        <Route path="/login" exact component={Login} />

        <PrivateRoute path="/">
          {/* private routes go here */}
          <Layout />
        </PrivateRoute>
      </Switch>
    </>
  );
};
export default App;
