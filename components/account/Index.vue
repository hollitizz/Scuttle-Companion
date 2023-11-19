<template>
    <div class="grid grid-cols-3 relative w-full items-center p-2 h-[152px]">
        <AccountElo :account="account"/>
        <AccountInfos :account="account"/>
        <AccountActions :account="account"/>
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

<style lang="scss" scoped>
</style>