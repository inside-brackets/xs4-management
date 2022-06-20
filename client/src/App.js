import "./App.css";

import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Layout from "./components/layout/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";

function App() {
  return (
    <>
      {" "}
      <Switch>
        <Route path="/login" exact component={Login} />

        {/* <PrivateRoute path="/"> */}
        <Layout />
        {/* </PrivateRoute> */}
      </Switch>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
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
