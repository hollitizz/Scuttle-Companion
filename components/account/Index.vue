<template>
    <div class="grid grid-cols-3 relative h-full w-full items-center">
        <AccountElo class="pl-12" :account="account" />
        <AccountInfos :account="account" />
        <AccountActions :account="account" @delete="emits('delete')" />
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
