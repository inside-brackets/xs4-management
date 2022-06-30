import "./App.css";

import { Route, Switch } from "react-router-dom";
import React from "react";

import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      {" "}
      <Switch>
        <Route path="/login" exact component={Login} />

        <PrivateRoute path="/">
          <Layout />
        </PrivateRoute>
      </Switch>
    </>
  );
}

export default App;
