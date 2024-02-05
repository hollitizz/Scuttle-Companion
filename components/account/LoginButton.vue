<template>
    <VMenu theme="menu-transparent">
        <UiFormButton @click="login"> Se connecter </UiFormButton>
        <template #popper>
            <UiFormButton @click="login(true)" :small="true">
                Rester connecté
            </UiFormButton>
        </template>
    </VMenu>
</template>

<script lang="ts" setup>
import { Menu as VMenu } from 'floating-vue';

const useRiotClient = useRiotClientStore();

const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    }
});

async function login(stayConnected = false) {
    const { success, message } = await useRiotClient.login(
        props.account.username,
        props.account.password,
        stayConnected
    );
    if (success) {
        useToast.success(message);
    } else {
        useToast.error(message);
    }
}
</script>

<style lang="scss" scoped></style>
