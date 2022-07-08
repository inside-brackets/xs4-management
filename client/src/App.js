import "./App.css";

import { Route, Switch } from "react-router-dom";
import React from "react";

import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Switch>
        <Route path="/login" exact component={Login} />

        <PrivateRoute path="/">
          <Layout />
        </PrivateRoute>
      </Switch>
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
    </>
  );
}

export default App;
