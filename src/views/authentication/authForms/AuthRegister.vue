<template>
  <!-- <v-btn block color="primary" variant="outlined" class="text-lightText googleBtn">
    <img :src="Google" alt="google" />
    <span class="ml-2">Registre-se com Google</span></v-btn
  >
  <v-row>
    <v-col class="d-flex align-center">
      <v-divider class="custom-devider" />
      <v-btn variant="outlined" class="orbtn" rounded="md" size="small">OU</v-btn>
      <v-divider class="custom-devider" />
    </v-col>
  </v-row>
  <h5 class="text-h5 text-center my-4 mb-8">Registre-se com Email</h5> -->
  <v-form ref="Regform" lazy-validation action="/dashboards/analytical" class="mt-7 loginForm">
    <v-row>
      <v-col cols="12" sm="5">
        <v-select
          color="primary"
          variant="outlined"
          v-model="treatment"
          :items="items"
          item-title="state"
          item-value="abbr"
          label="Tratamento"
          density="comfortable"
          persistent-hint
          return-object
          single-line
          hide-details
        >
        </v-select>
      </v-col>
      <v-col cols="12" sm="7">
        <v-text-field
          v-model="username"
          density="comfortable"
          hide-details="auto"
          variant="outlined"
          color="primary"
          label="Nome completo"
          :rules="usernameRules"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-text-field
      v-model="cpf"
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      class="my-4"
      color="primary"
      label="CPF"
      :rules="cpfRules"
    ></v-text-field>

    <v-text-field
      v-model="phone_number"
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      class="my-4"
      color="primary"
      label="Telefone"
      :rules="phoneNumberRules"
    ></v-text-field>
      
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="Email"
      class="my-4"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
    ></v-text-field>

    <v-text-field
      v-model="password1"
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

    <v-text-field
      v-model="password2"
      :rules="passwordRules"
      label="Confirme sua senha"
      required
      density="comfortable"
      variant="outlined"
      color="primary"
      hide-details="auto"
      :append-icon="show1 ? '$eye' : '$eyeOff'"
      :type="show1 ? 'text' : 'password'"
      @click:append="show1 = !show1"
      class="pwdInput my-4"
    ></v-text-field>

    <div class="d-sm-inline-flex align-center mt-2 mb-7 mb-sm-0 font-weight-bold">
      <v-checkbox
        v-model="accept_terms"
        :rules="[(v: any) => !!v || 'Você precisa aceitar para continuar!']"
        label="Concorda com?"
        required
        color="primary"
        class="ms-n2"
        hide-details
      ></v-checkbox>
      <a href="#" class="ml-1 text-lightText">Termos e condições</a>
    </div>
    <v-btn color="secondary" :loading="loading" block class="mt-5" variant="flat" size="large" @click="validate()">Registrar-se</v-btn>
    <div v-if="hasError" class="mt-2">
      <v-alert color="error" closable @click:close="hasError = false">
        <span v-for="erro in apiError">
          {{ erro[0] }}
        </span>
      </v-alert>
    </div>
  </v-form>
  <div class="mt-5 text-right">
    <v-btn variant="plain" to="/auth/login" class="mt-2 text-capitalize mr-n2">Já possui uma conta?</v-btn>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Google from '@/assets/images/auth/social-google.svg';
import { router } from '@/router';
import request from '@/services/axios';

// Types
import type { User } from '@/types/common/index'
import type { AxiosError } from 'axios';



const accept_terms = ref(false);
const show1 = ref(false);
const Regform = ref();
const email = ref('');
const username = ref('');
const treatment = ref();
const cpf = ref('');
const password1 = ref('');
const password2 = ref('');
const phone_number = ref('');

const hasError = ref(false)
const loading = ref(false)
const apiError = ref()

const items = [
  'Dr.',
  'Dra.',
  'Nutri',
  'Aluno(a)' 
];

const passwordRules = ref([
  (v: string) => !!v || 'Senha é obriagtoria',
  (v: string) => (v && v.length <= 10) || 'Senha precisa ser maior que 10 caracters'
]);

const cpfRules = ref([
  (v: string) => !!v || 'CPF é obriagtorio',
]);

const usernameRules = ref([
  (v: string) => !!v || 'Nome é obriagtorio',
]);

const phoneNumberRules = ref([
  (v: string) => !!v || 'Telefone é obriagtorio',
]);


const emailRules = ref([
  (v: string) => !!v || 'E-mail é obrigatorio', 
  (v: string) => /.+@.+\..+/.test(v) || 'E-mail precisa ser valido']
);

async function validate() {
  const { valid } = await Regform.value.validate();
  if(valid) {
  
    try {
      loading.value = true
      const response = await request.post('/account/registration/', {
        'email': email.value,
        'password1': password1.value,
        'password2':password2.value,
        'username': username.value,
        'treatment': treatment.value,
        'cpf': cpf.value,
        'accept_terms': accept_terms.value,
        'phone_number': phone_number.value
      })
      loading.value = false
      router.push({name: 'Login'});
    } catch (error: any) {
      loading.value = false
      const erro = error as AxiosError
      hasError.value = true
      if(erro.status === 400) {
        apiError.value = erro.response?.data
      } else {
        apiError.value = `Erro desconhecido, tente novamente mais tarde. status: ${erro.status}`
      }
    }
  }
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
</style>
