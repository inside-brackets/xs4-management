import axios from "axios";
import { toast } from "react-toastify";
import {
  ADD_PROJECT_REQUEST,
  ADD_PROJECT_SUCCESS,
  ADD_PROJECT_FAIL,
  GET_PROJECTS_SUCCESS,
  GET_PROJECTS_FAIL,
  GET_PROJECTS_REQUEST
} from "../constant";

export const addProject = project => async dispatch => {
  try {
    dispatch({ type: ADD_PROJECT_REQUEST });

    let config = {
      Headers: {
        "Content-Type": "application/json"
      }
    };

    let { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/pro/`,
      project,
      config
    );

    dispatch({ type: ADD_PROJECT_SUCCESS, payload: data });
    toast.success("Project Created Successfully");
  } catch (error) {
    dispatch({
      type: ADD_PROJECT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

export const getProjects = () => async dispatch => {
  try {
    dispatch({ type: GET_PROJECTS_REQUEST });

    let config = {
      Headers: {
        "Content-Type": "application/json"
      }
    };

    let { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/projects/`,
      config
    );

    dispatch({ type: GET_PROJECTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_PROJECTS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};
