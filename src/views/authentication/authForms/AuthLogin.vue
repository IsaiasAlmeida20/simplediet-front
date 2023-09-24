<template>
  <!-- <v-btn block color="primary" variant="outlined" class="text-lightText googleBtn">
    <img :src="Google" alt="google" />
    <span class="ml-2">Entrar com Google</span></v-btn
  >
  <v-row>
    <v-col class="d-flex align-center">
      <v-divider class="custom-devider" />
      <v-btn variant="outlined" class="orbtn" rounded="md" size="small">OU</v-btn>
      <v-divider class="custom-devider" />
    </v-col>
  </v-row>
  <h5 class="text-h5 text-center my-4 mb-8">Entrar com Email</h5> -->
  <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="Email"
      class="mt-4 mb-8"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
    ></v-text-field>
    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="Senha"
      required
      density="comfortable"
      variant="outlined"
      color="primary"
      hide-details="auto"
      :append-icon="show1 ? '$eye' : '$eyeOff'"
      :type="show1 ? 'text' : 'password'"
      @click:append="show1 = !show1"
      class="pwdInput"
    ></v-text-field>

    <div class="d-sm-flex align-center mt-2 mb-7 mb-sm-0">
      <div class="ml-auto">
        <a href="javascript:void(0)" class="text-primary text-decoration-none">Esqueceu sua senha?</a>
      </div>
    </div>
    <v-btn color="secondary" :loading="isSubmitting" block class="mt-5" variant="flat" size="large" :disabled="valid" type="submit">
      Entrar</v-btn
    >
    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </Form>
  <div class="mt-5 text-right">
    <v-btn variant="plain" to="/auth/register" class="mt-2 text-capitalize mr-n2">Não possui conta?</v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Google from '@/assets/images/auth/social-google.svg';
import { useAuthStore } from '@/stores/auth';
import { Form } from 'vee-validate';
import request from '@/services/axios'

const checkbox = ref(false);
const valid = ref(false);
const show1 = ref(false);
//const logform = ref();
const email = ref('isaias@example.com');
const password = ref('badrequest');
const passwordRules = ref([
  (v: string) => !!v || 'Senha é obrigatoria',
]);
const emailRules = ref([
  (v: string) => !!v || 'E-mail is required', 
  (v: string) => /.+@.+\..+/.test(v) || 'E-mail precisa ser válido'
]);

async function validate() {
  // const authStore = useAuthStore();
  // return authStore.login(email.value, password.value).catch((error) => setErrors({ apiError: error }));
  const response = await request.post('/account/login/', {
    'email': email.value,
    'password': password.value
  })
  console.log(response)
}
</script>

<style lang="scss">
.custom-devider {
  border-color: rgba(0, 0, 0, 0.08) !important;
}
.googleBtn {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 30px 0 20px 0;
}
.outlinedInput .v-field {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: none;
}
.orbtn {
  padding: 2px 40px;
  border-color: rgba(0, 0, 0, 0.08);
  margin: 20px 15px;
}
.pwdInput {
  position: relative;
  .v-input__append {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 500;
  }
}
</style>
