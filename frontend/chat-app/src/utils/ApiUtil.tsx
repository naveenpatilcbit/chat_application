/*
    This should contain an Utility method, where my backend base url and authentication logic is added.

*/
import axios, { AxiosRequestConfig } from "axios";

const API_BASE_URL = "http://localhost:5001/api"; // Update as needed

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API Wrapper with Type Safety
const api = {
  get: async <T,>(endpoint: string, params?: object): Promise<T> => {
    try {
      const response = await apiClient.get<T>(endpoint, { params });
      return response.data;
    } catch (error: any) {
      console.error("GET Error:", error.response?.data || error.message);
      throw error;
    }
  },

  post: async <T,>(
    endpoint: string,
    data: object,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await apiClient.post<T>(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      console.error("POST Error:", error.response?.data || error.message);
      throw error;
    }
  },

  put: async <T,>(
    endpoint: string,
    data: object,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await apiClient.put<T>(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      console.error("PUT Error:", error.response?.data || error.message);
      throw error;
    }
  },

  delete: async <T,>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await apiClient.delete<T>(endpoint, config);
      return response.data;
    } catch (error: any) {
      console.error("DELETE Error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default api;
