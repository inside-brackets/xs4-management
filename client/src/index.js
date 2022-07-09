import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store/index";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./assets/boxicons-2.0.7/css/boxicons.min.css";
import "./assets/css/grid.css";
import "./assets/css/theme.css";
import "react-toastify/dist/ReactToastify.css";
import "./assets/css/index.css";
import "./index.css";

import App from "./App";

document.title = "Xs4 Managemant Portal";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);
