import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLcuStore = defineStore('useLcuStore', () => {
    const lcu = ref();

    return {
        lcu
    }
});