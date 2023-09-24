// Utilities
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Types
import type { User } from '@/types/common/index'

export const useUserStore = defineStore('user', () => {
    const id = ref<number | string>('')
    const username = ref<string>('')
    const email = ref<string>('')
    const cpf = ref<string>('')
    const phone_number = ref<string>('')
    const treatment = ref<string>('')
    const accept_terms = ref<boolean>(false)

    //getters
    const user = computed((): User => {
        return {
            id: id.value,
            username: username.value,
            email: email.value,
            cpf: cpf.value,
            phone_number: phone_number.value,
            treatment: treatment.value,
            accept_terms: accept_terms.value
        }
    })

    //actions
    const setUser = (user: User) => {
        id.value = user.id
        username.value = user.username
        email.value = user.email
        cpf.value = user.cpf
        phone_number.value = user.phone_number
        treatment.value = user.treatment
        accept_terms.value = user.accept_terms
    }

    return {
        id,
        username,
        email,
        cpf,
        phone_number,
        treatment,
        accept_terms,
        user,
        setUser
    }
})