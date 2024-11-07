import axios, { HttpStatusCode, type AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth'

const production = import.meta.env.MODE === 'production'
const BASE_URL = production ? 'https://simplediet-back.onrender.com/' : import.meta.env.VITE_API_URL
const URL = production ? 'https://simplediet.com.br/login' : 'http://127.0.0.1:8080/login'

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh_token")
  try {
    const response = await instance.post('/account/token/refresh/', { refresh })
    console.log('Token refreshed:', response.data)
    localStorage.setItem("access_token", response.data.access)
    return response
  } catch (error: any) {
    console.error('Error refreshing token:', error.response?.data)
    throw error
  }
}

// Interceptor de requisição para adicionar o token atualizado
instance.interceptors.request.use(config => {
  const access = localStorage.getItem("access_token")
  if (access) {
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
}, error => Promise.reject(error))

// Interceptor de resposta para lidar com erros 401 e atualizar o token
instance.interceptors.response.use(
  response => response,
  async (error) => {
    const auth = useAuthStore()
    const originalRequest = error.config
    const errorResponse = error.response

    if (errorResponse?.data?.detail === "No valid refresh token found.") {
      console.warn('Refresh token invalid, logging out...')
      auth.logout()
      return
    }

    if (errorResponse?.status === HttpStatusCode.Unauthorized && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshResponse = await refreshAccessToken()

        if (refreshResponse?.status === HttpStatusCode.Ok) {
          originalRequest.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`
          return instance(originalRequest)
        }
      } catch (refreshError: any) {
        console.error('Failed to refresh token:', refreshError.response?.data)
        auth.logout()
      }
    }

    return Promise.reject(error)
  }
)

export default instance
