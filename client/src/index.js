import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store/index";

import "./assets/css/grid.css";
import "./assets/css/theme.css";
import "./assets/css/index.css";

import App from "./App";

document.title = "Xs4 Managemant Portal";

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
