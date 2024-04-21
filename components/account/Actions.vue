<template>
    <div class="flex-center flex flex-col gap-2 items-center">
        <AccountLoginButton :account="account" />
        <!-- <UiFormButton
            @click="emits('delete')"
            aria-label="Supprimer"
            class="ml-2"
        >
            Supprimer
        </UiFormButton> -->
    </div>
</template>

<script lang="ts" setup>
defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    }
});

const emits = defineEmits<{
    (e: 'delete'): void;
}>();
</script>

<style lang="scss" scoped></style>
