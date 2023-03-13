import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  userLoginReducer,
  userRegisterReducer,
  userUpdateProfileReducer
} from "./Reducers/userReducer";
import { projectReducer } from "./Reducers/projectReducer";
import { logsReducer } from "./Reducers/logsReducer";
// Reducers
let reducers = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userUpdateProfile: userUpdateProfileReducer,
  project: projectReducer,
  logs: logsReducer
});

// Inital State

let userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;
let initialState = {
  userLogin: {
    userInfo: userInfoFromStorage
  }
};

let middlewares = [thunk];

const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares))
);

export default store;
