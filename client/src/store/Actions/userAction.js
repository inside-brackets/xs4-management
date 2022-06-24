import axios from 'axios';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
} from '../constant';

export const Login = (email, password) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });


    let { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/users/token`,
      { email, password },
    );

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem(
      'userInfo',
      JSON.stringify(getState().userLogin.userInfo)
    );
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const Register =
  (name, email, password) => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_REGISTER_REQUEST });

      let config = {
        Headers: {
          'Content-Type': 'application/json',
        },
      };

      let { data } = await axios.post(
        '/api/v1/users/register',
        { name, email, password },
        config
      );

      dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

      localStorage.setItem(
        'userInfo',
        JSON.stringify(getState().userRegister.userInfo)
      );
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const Logout = () => async (dispatch) => {
  dispatch({ type: USER_LOGOUT });

  localStorage.clear();
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put('/api/v1/users', user, config);
    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS });

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
