import axios from 'axios';
import { useEffect } from 'react';
import { useUI } from '../context/UIContext';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true
});

export const AxiosInterceptor = ({ children }) => {
  const { showLoader, hideLoader, showError } = useUI();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        // Skip loader for specific requests if needed (e.g., background polls)
        if (!config.headers['X-Skip-Loader']) {
          showLoader();
        }
        return config;
      },
      (error) => {
        hideLoader();
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        hideLoader();
        return response;
      },
      (error) => {
        hideLoader();
        const message = error.response?.data?.message || 'Something went wrong. Please try again.';
        showError(message);
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [showLoader, hideLoader, showError]);

  return children;
};

export default api;