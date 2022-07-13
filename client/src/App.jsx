import React from "react";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";

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
};
export default App;
