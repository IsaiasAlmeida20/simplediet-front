import axios, { HttpStatusCode } from 'axios'
import { useAuthStore } from '@/stores/auth'

const production = import.meta.env.MODE === 'production'
const BASE_URL = production ? 'https://simplediet.com.br/api/' : import.meta.env.VITE_API_URL
const URL = production ? 'https://simplediet.com.br/login' : 'http://127.0.0.1:8080/login'

const instance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	}
})

const refreshAccessToken = async () => {
	const response = await instance.post('/account/token/refresh/')
	return response.data
}

instance.defaults.headers.common['Content-Type'] = 'application/json'

instance.interceptors.response.use(response => response, async (error) => {
	const auth = useAuthStore()
	const originalRequest = error.config
	const errorReponse = error.response
	const detail = errorReponse?.data?.detail
	if (detail === "No valid refresh token found.") {
		auth.logout()
		return
	}

	if (errorReponse?.status === HttpStatusCode.Unauthorized && !originalRequest._retry) {
		originalRequest._retry = true

		await refreshAccessToken()
		return instance(originalRequest)
	}
	return Promise.reject(error)
})

export default instance