import axios from "axios";

const baseURL = import.meta.env.VITE_DB_PORT;

const PublicInstance = axios.create({
  baseURL,
  timeout: 10000,
});

export { PublicInstance };
