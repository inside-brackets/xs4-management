import axios from "axios";

const HttpIntercept = (props) => {
  axios.interceptors.request.use(
    (request) => {
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      if (request.url.includes(process.env.REACT_APP_BACKEND_URL))
        request.headers.common["Authorization"] = `Bearer ${userInfo?.token}`;
      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      // Edit response config
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default HttpIntercept;
