<script setup>
import { Nav, Alert } from "@/components";
import { useAuthStore } from "@/stores";

const authStore = useAuthStore();
</script>

<template>
  <div :class="authStore.user && 'bg-light'">
    <Nav />
    <Alert />
    <div class="container-fluid pt-4 pb-4">
      <div class="app-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style>
@import "@/assets/base.css";
</style>
