<script setup>
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
</script>

<template>
    <div v-if="authStore.getUser">
        <h1>Hi {{authStore.getUser.username}}!</h1>
        <p>You're logged in with Vue 3 + Pinia & JWT!!</p>
        <p><router-link to="/usuarios">Gerenciar Usuarios</router-link></p>
    </div>
</template>
