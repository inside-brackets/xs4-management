import axios from "axios";
import {
  ADD_LOG_FAIL,
  ADD_LOG_REQUEST,
  ADD_LOG_SUCCESS,
  GET_LOGS,
  UPDATE_LOG_SUCCESS,
  UPDATE_LOG_FAIL,
  UPDATE_LOG_REQUEST
} from "../constant";
import { toast } from "react-toastify";

export const getLogs = () => async (dispatch, getState) => {
  try {
    const userId = getState()?.userLogin?.userInfo?._id;

    let config = {
      Headers: {
        "Content-Type": "application/json"
      }
    };

    let { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/log/`,
      { user: userId },
      config
    );

    dispatch({ type: GET_LOGS, payload: data });
  } catch (error) {
    //     dispatch({
    //       type: GET_PROJECTS_FAIL,
    //       payload:
    //         error.response && error.response.data.message
    //           ? error.response.data.message
    //           : error.message
    //     });
    console.log(error);
  }
};

export const addLog = log => async (dispatch, getState) => {
  try {
    const userId = getState()?.userLogin?.userInfo?._id;
    dispatch({ type: ADD_LOG_REQUEST });

    let config = {
      Headers: {
        "Content-Type": "application/json"
      }
    };

    let { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/log/create/`,
      { ...log, user: userId },
      config
    );

    dispatch({ type: ADD_LOG_SUCCESS, payload: data });
    toast.success("Log Created Successfully");
  } catch (error) {
    dispatch({
      type: ADD_LOG_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

export const updateLog = log => async (dispatch, getState) => {
  try {
    //     const userId = getState()?.userLogin?.userInfo?._id;
    dispatch({ type: UPDATE_LOG_REQUEST });

    let config = {
      Headers: {
        "Content-Type": "application/json"
      }
    };

    let { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/log/update/`,
      log,
      config
    );

    dispatch({ type: UPDATE_LOG_SUCCESS, payload: data });
    toast.success("Log Created Successfully");
  } catch (error) {
    dispatch({
      type: UPDATE_LOG_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};
