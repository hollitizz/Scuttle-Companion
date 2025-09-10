<template>
    <div class="grid grid-cols-3 relative h-full w-full items-center">
        <AccountElo class="pl-12" :account="account" />
        <AccountInfos :account="account" @click:info="handleOpen" />
        <AccountActions
            :account="account"
            :editMode="editMode"
            @delete="emits('delete')"
        />

        <AccountInfosChampList
            v-if="infoIsOpen"
            v-model:search="search"
            :account="account"
            @close="handleClose"
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

const search = defineModel<string>('search', { required: true });

const emits = defineEmits<{
    (e: 'delete'): void;
}>();

const infoIsOpen = ref(false);

function handleOpen() {
    infoIsOpen.value = true;
}

function handleClose() {
    infoIsOpen.value = false;
}
</script>

<style lang="scss" scoped></style>
