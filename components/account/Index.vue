<template>
    <div class="grid grid-cols-3 relative h-full w-full items-center">
        <AccountElo class="pl-12" :account="account" />
        <AccountInfos :account="account" />
        <AccountActions :account="account" />
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    }
});
</script>

<style lang="scss" scoped></style>
