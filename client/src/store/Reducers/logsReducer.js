import {
  GET_LOGS,
  ADD_LOG_SUCCESS,
  ADD_LOG_REQUEST,
  ADD_LOG_FAIL,
  UPDATE_LOG_FAIL,
  UPDATE_LOG_REQUEST,
  UPDATE_LOG_SUCCESS
} from "../constant";

export const logsReducer = (state = { logs: null }, action) => {
  switch (action.type) {
    case GET_LOGS:
      return { loading: false, logs: action.payload };
    case "GET_LOGS_REQUEST":
      return { loading: true };
    case "GET_LOGS_FAIL":
      return { loading: false, error: action.payload };
    case ADD_LOG_SUCCESS:
      return {
        ...state,
        addLoading: false,
        logs: [...state.logs, action.payload]
      };
    case ADD_LOG_REQUEST:
      return {
        ...state,
        addLoading: true
      };
    case ADD_LOG_FAIL:
      return {
        addLoading: false,
        error: action.payload
      };
    case UPDATE_LOG_FAIL:
      return {
        ...state,
        addLoading: false,
        error: action.payload
      };
    case UPDATE_LOG_REQUEST:
      return {
        ...state,
        addLoading: true
      };
    case UPDATE_LOG_SUCCESS:
      return {
        ...state,
        logs: state.logs.map(item =>
          item._id === action.payload._id ? action.payload : item
        )
      };
    default:
      return state;
  }
};
