<template>
    <div class="flex-center">
        <UiFormButton @click="login"> Se connecter </UiFormButton>
    </div>
</template>

<script lang="ts" setup>
import { useRiotClientStore } from '~/store/riotClient';

const useRiotClient = useRiotClientStore();

const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    }
});

async function login() {
    const { success, message } = await useRiotClient.login(
        props.account.username,
        props.account.password
    );
    if (success) {
        useToast.success(message);
    } else {
        useToast.error(message);
    }
}
</script>

<style lang="scss" scoped></style>
