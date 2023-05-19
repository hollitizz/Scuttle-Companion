<template>
    <div class="login">
        <div class="icon">
            <img src="../assets/icon.png" alt="Logo" />
            <h1>League Account Manager</h1>
        </div>
        <UiInputPassword
            v-model="password"
            @enter="sendPassword"
            label="Mot de passe"
        />
        <UiButton @click="sendPassword">Connexion</UiButton>
    </div>
</template>
<script setup lang="ts">
import UiInputPassword from './ui/input/Password.vue';
import UiButton from './ui/input/Button.vue';
import { ref } from 'vue';

const emits = defineEmits(['update:modelValue']);

const password = ref('' as string);

function sendPassword() {
    emits('update:modelValue', password.value);
}
</script>

<style lang="scss" scoped>
.login {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    .icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 23rem;
        background-color: var(--primary);
        padding: 10px;
        border-radius: 10px;
        img {
            width: 20rem;
            height: 20rem;
        }

        h1 {
            width: 27rem;
            text-align: center;
            font-size: 2rem;
            margin: 0;
            padding: 0;
        }
    }
}
</style>
