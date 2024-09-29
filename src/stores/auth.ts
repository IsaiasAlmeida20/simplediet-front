import { defineStore } from 'pinia';
import { ref } from 'vue';
import { router } from '@/router';
import request from '@/services/axios';

// Types
import type { User } from '@/types/common/index'
import type { AxiosError } from 'axios';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore('auth', () => {

  const user = ref<User>()
  const returnUrl = ref<string | null>()
  const hasError = ref(false)
  const apiError = ref()

  const login = async (email: string, password: string) => {
    try {
      const response = await request.post('/account/login/', {
        email,
        password
      })
      user.value = response.data.user;
      router.push(returnUrl.value || '/dashboard/default');
    } catch (error: any) {
      console.log('cai no catch')
      const erro = error as AxiosError
      hasError.value = true
      if(erro.status === 400) {
        apiError.value = erro.response?.data
      } else {
        apiError.value = `Erro desconhecido, tente novamente mais tarde. status: ${erro.status}`
      }
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await request.get('/account/user/')
      user.value = response.data.user;
    } catch (error) {
      const erro = error as AxiosError
      console.error(erro)
    }
  }

  const logout = async () => {
    await request.post('/account/logout/')
    user.value = undefined
    router.push('/auth/login');
  }

  return {
    user,
    returnUrl,
    hasError,
    apiError,
    login,
    fetchUserData,
    logout
  }
});
