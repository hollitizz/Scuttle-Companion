<template>
    <UiModal
        class="w-[20rem] h-[16rem]"
        :isOpen="isOpen"
        @update:isOpen="emits('update:isOpen', $event)"
    >
        <form
            @submit.prevent="onSubmit"
            class="flex-center flex-col gap-4 h-full"
        >
            <h2 class="self-start">Ajouter un compte</h2>
            <UiFormInputWithTitle
                v-model="summonerName"
                v-tooltip="
                    'Nom temporaire du compte (jusqu\'à la première connexion)'
                "
                :title="'Pseudo du compte'"
                class="w-60 mt-auto"
            />
            <UiFormInputWithTitle
                v-model="username"
                v-tooltip="'Utilisé pour se connecter'"
                title="Nom du compte"
                class="w-60"
                required
            />
            <UiFormInputWithTitle
                v-model="password"
                title="Mot de passe"
                type="password"
                class="w-60"
                required
            />
            <UiFormButton type="submit" class="w-20 mb-auto"
                >Ajouter</UiFormButton
            >
        </form>
    </UiModal>
</template>

<script lang="ts" setup>
import { useAccountsStore } from '~/stores/accounts';
import { storeToRefs } from 'pinia';

const accountsStore = useAccountsStore();
const { accounts } = storeToRefs(accountsStore);

defineProps({
    isOpen: {
        type: Boolean,
        required: true
    }
});

const emits = defineEmits<{
    (e: 'update:isOpen', value: boolean): void;
}>();

const summonerName = ref('');
const username = ref('');
const password = ref('');

function onSubmit() {
    accountsStore.addAccount({
        summoner_name: summonerName.value,
        username: username.value,
        password: password.value
    });
    summonerName.value = '';
    username.value = '';
    password.value = '';
    emits('update:isOpen', false);
}
</script>

<style lang="scss" scoped></style>
~/stores/accounts
