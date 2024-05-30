<script setup>
import { Form, Field } from "vee-validate";
import * as Yup from "yup";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { computed, ref, watch, onMounted } from "vue";

import { useAuthStore, useUsersStore, useAlertStore } from "@/stores";
import { router } from "@/router";
import { testCpf } from "@/helpers";

const authStore = useAuthStore();
const usersStore = useUsersStore();
const alertStore = useAlertStore();
const route = useRoute();

const id = ref(route.params.id);

onMounted(() => {
  if (id.value) {
    usersStore.getById(id.value);
  } else {
    usersStore.getUser.usuario = {};
  }
});

watch(
  () => route.params.id,
  (newVal, oldVal) => {
    if (route.params.id && newVal !== oldVal) {
      id.value = newVal;
      usersStore.getById(newVal);
    }
  }
);

const isCurrentUser = computed(() => authStore.getUser.id === Number(id.value));

const title = computed(() =>
  id.value
    ? isCurrentUser.value
      ? "Meu Cadastro"
      : "Editar Usuário"
    : "Adicionar Usuário"
);

const initialValues = computed(() => ({
  ...usersStore.getUser.usuario,
  password: "",
  tipos: usersStore.getUser.tipos?.[0] || "", // Default to an empty string if tipos is undefined or empty
}));

const phoneRegex = /^\(\d{2}\) (?:[2-9]\d{3}-\d{4}|9\d{4}-\d{4})$/;

const schema = Yup.object().shape({
  nome: Yup.string().required("O nome é obrigatório"),
  email: Yup.string()
    .required("O e-mail é obrigatório")
    .email("E-mail inválido"),
  dataNascimento: Yup.date().required("A data de nascimento é obrigatória"),
  cpf: Yup.string()
    .required("O CPF é obrigatório")
    .test("is-valid-cpf", "CPF inválido", (value) =>
      value ? testCpf(value) : true
    ),
  telefone: Yup.string()
    .matches(phoneRegex, "Formato de telefone inválido")
    .required("O telefone é obrigatório"),
  username: Yup.string().required("O nome de usuário é obrigatório"),
  tipos: Yup.string().required("O tipo de usuário é obrigatório"),
  password: Yup.string()
    .when([], {
      is: () => !id.value,
      then: Yup.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
      otherwise: Yup.string().notRequired(),
    })
    .test(
      "password",
      "A senha deve ter pelo menos 8 caracteres",
      (value) => (value ? value?.length >= 8 : true) // Only validate if password is not empty
    ),
});

async function onSubmit(values) {
  try {
    const userInfo = {
      usuario: {
        id: usersStore.getUser.usuario?.id || null,
        nome: values.nome,
        email: values.email,
        dataNascimento: values.dataNascimento,
        cpf: values.cpf,
        telefone: values.telefone,
        username: values.username,
        password: values.password
          ? values.password
          : usersStore.getUser.usuario?.password,
      },
      tipos: [values.tipos],
    };
    if (isCurrentUser.value) {
      await usersStore.update(userInfo.usuario, userInfo.tipos);
    } else {
      await usersStore.register(userInfo);
    }
    const message = usersStore.getUser ? "Usuário atualizado" : "Usuário adicionado";
    await router.push("/usuarios");
    alertStore.success(message);
  } catch (error) {
    alertStore.error(error);
  }
}
</script>

<template>
  <h1>{{ title }}</h1>
  <hr class="mb-5" />
  <template v-if="!(loading || error)">
    <Form
      class="col-md-6 offset-md-3"
      @submit="onSubmit"
      :validation-schema="schema"
      :initial-values="initialValues"
      v-slot="{ errors, isSubmitting }"
    >
      <div class="form-group">
        <label>Nome</label>
        <Field
          name="nome"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.nome }"
        />
        <div class="invalid-feedback">{{ errors.nome }}</div>
      </div>
      <div class="form-group">
        <label>E-mail</label>
        <Field
          name="email"
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errors.email }"
        />
        <div class="invalid-feedback">{{ errors.email }}</div>
      </div>
      <div class="form-group">
        <label>Data de Nascimento</label>
        <Field
          name="dataNascimento"
          type="date"
          class="form-control"
          :class="{ 'is-invalid': errors.dataNascimento }"
        />
        <div class="invalid-feedback">{{ errors.dataNascimento }}</div>
      </div>
      <div class="form-group">
        <label>CPF</label>
        <Field
          name="cpf"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.cpf }"
          v-mask="'###.###.###-##'"
        />
        <div class="invalid-feedback">{{ errors.cpf }}</div>
      </div>
      <div class="form-group">
        <label>Telefone</label>
        <Field
          name="telefone"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.telefone }"
          v-mask="['(##) ####-####', '(##) #####-####']"
        />
        <div class="invalid-feedback">{{ errors.telefone }}</div>
      </div>
      <div class="form-group">
        <label>Nome de Usuário</label>
        <Field
          name="username"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.username }"
        />
        <div class="invalid-feedback">{{ errors.username }}</div>
      </div>
      <div class="form-group">
        <label>
          Senha
          <em v-if="id">(Deixe vazio para manter a mesma senha)</em>
        </label>
        <Field
          name="password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.password }"
          autocomplete="new-password"
        />
        <div class="invalid-feedback">{{ errors.password }}</div>
      </div>
      <div class="form-group">
        <label>Tipo de Usuário</label>
        <Field
          name="tipos"
          as="select"
          class="form-control"
          :class="{ 'is-invalid': errors.tipos }"
          :disabled="isCurrentUser"
        >
          <option value="">Selecione</option>
          <option value="ROLE_USER">usuário</option>
          <option value="ROLE_ADMIN">admin</option>
        </Field>
        <div class="invalid-feedback">{{ errors.tipos }}</div>
      </div>
      <div class="form-group">
        <button class="btn btn-primary" :disabled="isSubmitting">
          <span
            v-show="isSubmitting"
            class="spinner-border spinner-border-sm mr-1"
          ></span>
          Salvar
        </button>
        <router-link to="/usuarios" class="btn btn-link ml-2"
          >Cancelar</router-link
        >
      </div>
    </Form>
  </template>
  <template v-if="loading">
    <div class="text-center m-5">
      <span class="spinner-border spinner-border-lg align-center"></span>
    </div>
  </template>
  <template v-if="error">
    <div class="text-center m-5">
      <div class="text-danger">
        Erro ao carregar dados do usuário: {{ error }}
      </div>
    </div>
  </template>
</template>
