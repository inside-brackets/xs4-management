import axios from "axios";
import {
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAIL
} from "../constant";
export const getUsers = () => async dispatch => {
  try {
    dispatch({ type: GET_USERS_REQUEST });

    let config = {
      Headers: {
        "Content-Type": "application/json"
      }
    };

    const { data } = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/users/100/0`,
      data: "",
      config
    });

    dispatch({ type: GET_USERS_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: GET_USERS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};
