<template>
    <div class="flex-center">
        <AccountLoginButton :account="account" />
    </div>
</template>

<script lang="ts" setup>
defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    }
});
</script>

<style lang="scss" scoped></style>
