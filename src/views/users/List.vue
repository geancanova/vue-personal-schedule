<script setup>
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useUsersStore } from "@/stores";

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);
const searchTerm = ref("");

const formattedUsers = computed(() => {
  return usersStore.users.map((user) => ({
    ...user,
    dataNascimento: new Date(user.dataNascimento).toLocaleDateString("pt-BR"), // Formatting date
  }));
});

function search(term = "") {
  searchTerm.value = term;
  usersStore.getAll(term);
}

search();
</script>

<template>
  <div class="row">
    <div class="col-md-3">
      <h1 class="mb-3">Usuários</h1>
    </div>
    <div class="col-md-7 offset-md-2 d-md-flex justify-content-end">
      <div class="d-md-flex align-items-start">
        <div class="mb-3 text-right">
          <form class="input-group" @submit.prevent="search(searchTerm)">
            <input
              id="search-input"
              type="text"
              class="form-control"
              placeholder="Buscar usuário"
              v-model="searchTerm"
            />
            <div class="input-group-append">
              <button id="search-button" class="btn btn-primary" type="submit">
                buscar
              </button>
            </div>
          </form>
          <a href="#" @click.prevent="search()">Limpar busca</a>
        </div>
        <router-link
          to="/usuarios/adicionar"
          class="btn btn-success ml-md-2 mb-3 text-nowrap"
          >Adicionar Usuário</router-link
        >
      </div>
    </div>
  </div>
  <div class="table-responsive">
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Data de Nascimento</th>
          <th>CPF</th>
          <th>E-mail</th>
          <th>Telefone</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <template v-if="users.length">
          <tr v-for="user in formattedUsers" :key="user.id">
            <td>{{ user.nome }}</td>
            <td>{{ user.dataNascimento }}</td>
            <td>{{ user.cpf }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.telefone }}</td>
            <td style="white-space: nowrap">
              <router-link
                :to="`/usuarios/editar/${user.id}`"
                class="btn btn-sm btn-primary mr-1"
                >Editar</router-link
              >
              <!-- <button
                  @click="usersStore.delete(user.id)"
                  class="btn btn-sm btn-danger btn-delete-user"
                  :disabled="user.isDeleting"
                >
                  <span
                    v-if="user.isDeleting"
                    class="spinner-border spinner-border-sm"
                  ></span>
                  <span v-else>Delete</span>
                </button> -->
            </td>
          </tr>
        </template>
        <tr v-if="users.loading">
          <td colspan="6" class="text-center">
            <span class="spinner-border spinner-border-lg align-center"></span>
          </td>
        </tr>
        <tr v-if="users.error">
          <td colspan="6">
            <div class="text-danger">
              Erro ao carregar usuários: {{ users.error }}
            </div>
          </td>
        </tr>
        <tr v-if="!users.length">
          <td colspan="6">
            <div class="text-center pt-2">
              <p>Nenhum usuário encontrado.</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
