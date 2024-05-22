<script setup>
import { useAuthStore } from "@/stores";
import { ref, watch } from "vue";

const authStore = useAuthStore();
const loggedInUserId = ref(authStore.user?.id || null);
const loggedInUserRole = ref(authStore.user?.tipos[0] || null);

watch(
  () => authStore.user,
  (newValue) => {
    loggedInUserId.value = newValue?.id;
    loggedInUserRole.value = newValue?.tipos[0];
  }
);
</script>

<template>
  <nav v-show="authStore.user" class="navbar navbar-expand navbar-dark bg-dark">
    <div class="navbar-nav">
      <router-link to="/" class="nav-item nav-link">Home</router-link>
      <router-link
        to="/usuarios"
        class="nav-item nav-link"
        v-if="loggedInUserRole === 'ROLE_ADMIN'"
      >
        Usuários
      </router-link>
      <router-link
        :to="`/usuarios/editar/${loggedInUserId}`"
        class="nav-item nav-link"
        v-if="loggedInUserId"
      >
        Meu Cadastro
      </router-link>
      <button
        @click="authStore.logout()"
        class="btn btn-link nav-item nav-link"
      >
        Logout
      </button>
    </div>
  </nav>
</template>
