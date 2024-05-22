<script setup>
import { useAuthStore } from "@/stores";
// import { ref, watch } from "vue";

// Initialize the auth store
const authStore = useAuthStore();
</script>

<template>
  <!-- Only show the navigation bar if the user is logged in -->
  <nav v-if="authStore.user" class="navbar navbar-expand navbar-dark bg-dark">
    <div class="navbar-nav">
      <router-link to="/" class="nav-item nav-link">Home</router-link>

      <!-- Show the 'Usuários' link only if the user has an admin role -->
      <router-link
        v-if="authStore.user.tipos[0] === 'ROLE_ADMIN'"
        to="/usuarios"
        class="nav-item nav-link"
      >
        Usuários
      </router-link>

      <!-- Show the 'Meu Cadastro' link only if the user ID is defined -->
      <router-link
        :to="`/usuarios/editar/${authStore.user.id}`"
        class="nav-item nav-link"
      >
        Meu Cadastro
      </router-link>

      <!-- Logout button to trigger the logout function in the auth store -->
      <button @click="authStore.logout" class="btn btn-link nav-item nav-link">
        Logout
      </button>
    </div>
  </nav>
</template>
