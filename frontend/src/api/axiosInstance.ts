


import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: 'https://localhost',
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    const isUploadChunk = config.url?.includes("/upload-files");
    if (token) {
      // config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
      if (!isUploadChunk) {
        config.headers["Content-Type"] = "application/json";
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 ||
      error.response?.statusText === "Unauthorized"
    ) {
      // window.location.href = window.location.origin;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
