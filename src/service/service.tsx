import axios from "axios";
import Cookies from "js-cookie";

const baseURL = import.meta.env.VITE_DB_PORT;

const PublicInstance = axios.create({
  baseURL,
  timeout: 10000,
});

const PrivateInstance = axios.create({
  baseURL,
  timeout: 10000,
});

PrivateInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("_auth");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

PrivateInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove("_auth");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export { PublicInstance, PrivateInstance };
