<template>
    <div class="flex-center flex flex-col gap-2 items-center">
        <AccountLoginButton :account="account" />
        <div
            v-if="editMode || closing"
            @click="emits('delete')"
            aria-label="Supprimer"
            class="cursor-pointer hover:scale-[1.2] transition-transform absolute top-0 right-2 p-2 duration-200"
            :class="{
                opening,
                closing
            }"
        >
            <SvgDelete class="w-8 h-8" color="var(--red)" />
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
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

const opening = ref(false);
const closing = ref(false);

watch(
    () => props.editMode,
    value => {
        if (value) {
            opening.value = true;
            setTimeout(() => {
                opening.value = false;
            }, 300);
        } else {
            closing.value = true;
            setTimeout(() => {
                closing.value = false;
            }, 300);
        }
    }
);
</script>

<style lang="scss" scoped>
.opening {
    animation: opening 300ms ease-out;
}

.closing {
    animation: closing 300ms ease-in;
}

@keyframes opening {
    from {
        opacity: 0;
        transform: translateX(2rem);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes closing {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(2rem);
    }
}
</style>
