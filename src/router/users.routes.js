import { Layout, List, AddEdit } from '@/views/users';

export default {
    path: '/usuarios',
    component: Layout,
    children: [
        { path: '', component: List },
        { path: 'adicionar', component: AddEdit },
        { path: 'editar/:id', name: 'editUser', component: AddEdit },
    ]
};
