import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import { useAuthStore } from '@/stores';

const baseUrl = `${import.meta.env.VITE_API_URL}/api/usuario`;

export const useUsersStore = defineStore({
    id: 'users',
    state: () => ({
        users: {},
        user: {},
    }),
    actions: {
        async register(user) {
            await fetchWrapper.post(`${baseUrl}/salvar`, user);
        },
        async getAll(term) {
            this.users = { loading: true };
            try {
                this.users = await fetchWrapper.post(`${baseUrl}/pesquisar`, { 'termo': term });
            } catch (error) {
                this.users = { error };
            }
        },
        async getById(id) {
            this.user = { loading: true };
            try {
                const { object: userObj } = await fetchWrapper.get(`${baseUrl}/buscar/${id}`);
                this.user = userObj;
            } catch (error) {
                this.user = { error };
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);

            // update stored user if the logged in user updated their own record
            const authStore = useAuthStore();
            if (id === authStore.user.id) {
                // update local storage
                const user = { ...authStore.user, ...params };
                localStorage.setItem('user', JSON.stringify(user));

                // update auth user in pinia state
                authStore.user = user;
            }
        },
        async delete(id) {
            // add isDeleting prop to user being deleted
            this.users.find(x => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.users = this.users.filter(x => x.id !== id);

            // auto logout if the logged in user deleted their own record
            const authStore = useAuthStore();
            if (id === authStore.user.id) {
                authStore.logout();
            }
        },
    }
});
