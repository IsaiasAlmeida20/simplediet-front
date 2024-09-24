<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore()
</script>

<template>
  <!-- <div class="bg-lightwarning rounded-md pa-5 my-3 circle sm-circle lg-circle hide-menu">
    <h4>Upgrade To Pro</h4>
    <h6 class="text-subtitle-2 text-medium-emphasis pr-11 mb-3 mt-2">To get more features and components</h6>
    <v-btn color="warning" variant="flat" @click="auth.fetchUserData"> Go Premium </v-btn>
  </div> -->
</template>
