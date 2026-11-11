import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}
export interface AuthResponse {
  isAuthenticated: boolean;
}
export interface LogoutResponse {
  success: boolean;
  message?: string;
}

const host = 'http://localhost:4000'
const axiosInstance: AxiosInstance = axios.create({
  baseURL: host,
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
