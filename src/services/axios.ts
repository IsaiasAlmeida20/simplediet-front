import axios, { HttpStatusCode } from 'axios'
import { useAuthStore } from '@/stores/auth'

const production = import.meta.env.MODE === 'production'
const BASE_URL = production ? 'https://simplediet-back.onrender.com/api/' : import.meta.env.VITE_API_URL
const URL = production ? 'https://simplediet.com.br/login' : 'http://127.0.0.1:8080/login'

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Enviar cookies automaticamente
  headers: {
    'Content-Type': 'application/json',
  }
})

const refreshAccessToken = async () => {
  try {
    const response = await instance.post('/account/token/refresh/')
    console.log('Token refreshed:', response.data)
    return response
  } catch (error: any) {
    console.error('Error refreshing token:', error.response?.data)
    throw error
  }
}

instance.defaults.headers.common['Content-Type'] = 'application/json'

// Interceptor para lidar com respostas e erros
instance.interceptors.response.use(
  response => response, // Retornar a resposta normalmente se não houver erro
  async (error) => {
    const auth = useAuthStore()
    const originalRequest = error.config
    const errorResponse = error.response

    // Verifica se a resposta contém uma mensagem específica de erro de token
    if (errorResponse?.data?.detail === "No valid refresh token found.") {
      console.warn('Refresh token invalid, logging out...')
      auth.logout()
      return
    }

    // Verifica se houve um erro 401 (não autorizado) e tenta atualizar o token
    if (errorResponse?.status === HttpStatusCode.Unauthorized && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Tenta atualizar o token de acesso
        const refreshResponse = await refreshAccessToken()

        if (refreshResponse?.status === HttpStatusCode.Ok) {
          // Reenvia a requisição original com o novo token
          return instance(originalRequest)
        }
      } catch (refreshError: any) {
        console.error('Failed to refresh token:', refreshError.response?.data)
        auth.logout() // Deslogar se o refresh token falhar
      }
    }

    // Se não for um erro de token ou o refresh falhar, rejeita a promessa
    return Promise.reject(error)
  }
)

export default instance
