import axios from "axios";

const apiBaseURL =
  import.meta.env.VITE_API_URL || `${window.location.origin}/api`;

const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
});

export default api;
