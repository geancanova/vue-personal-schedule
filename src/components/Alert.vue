<script setup>
import { useAlertStore } from '@/stores';

const alertStore = useAlertStore();

</script>

<template>
    <div v-if="alertStore.getAlert" class="container">
        <div class="m-3">
            <div class="alert alert-dismissable" :class="alertStore.getAlert?.type">
                <button @click="alertStore.clear()" class="btn btn-link close">&times;</button>
                {{alertStore.getAlert?.message}}
            </div>
        </div>
    </div>
</template>