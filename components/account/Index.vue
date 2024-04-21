<template>
    <div
        class="grid grid-cols-3 relative h-full w-full items-center overflow-hidden"
    >
        <AccountElo class="pl-12" :account="account" />
        <AccountInfos :account="account" />
        <AccountActions
            :account="account"
            :editMode="editMode"
            @delete="emits('delete')"
        />
    </div>
</template>

<script lang="ts" setup>
defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    },
    editMode: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits<{
    (e: 'delete'): void;
}>();
</script>

<style lang="scss" scoped></style>
