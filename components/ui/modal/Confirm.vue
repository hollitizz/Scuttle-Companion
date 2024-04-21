<template>
    <UiModal :isOpen="isOpen" @update:isOpen="emits('update:isOpen', $event)">
        <div class="text-base">
            <slot name="information" />
        </div>
        <div class="flex-1 flex flex-col justify-center items-center w-full">
            <div class="text-sm font-semibold flex-1 flex-center mb-6">
                <slot name="question">
                    <h2>Êtes-vous sûr ?</h2>
                </slot>
            </div>

            <div class="flex w-full items-center justify-around">
                <UiFormButton
                    @click="
                        emits('no');
                        closeModal();
                    "
                    aria-label="Non"
                >
                    Non
                </UiFormButton>

                <UiFormButton
                    @click="
                        emits('yes');
                        closeModal();
                    "
                    aria-label="Oui"
                >
                    Oui
                </UiFormButton>
            </div>
        </div>
    </UiModal>
</template>

<script lang="ts" setup>
const modal = ref();

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    }
});

const emits = defineEmits<{
    (e: 'update:isOpen', value: boolean): void;
    (e: 'yes'): void;
    (e: 'no'): void;
}>();

onMounted(() => {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (!props.isOpen) return;
        if (event.key === 'Escape') {
            emits('no');
            closeModal();
        }
        if (event.key === 'Enter') {
            emits('yes');
            closeModal();
        }
    });
});

onUnmounted(() => {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (!props.isOpen) return;
        if (event.key === 'Escape') {
            emits('no');
            closeModal();
        }
        if (event.key === 'Enter') {
            emits('yes');
            closeModal();
        }
    });
});

function closeModal() {
    emits('update:isOpen', false);
}
</script>

<style lang="scss" scoped>
.modal {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .content {
        @apply flex h-48 flex-col justify-between items-start gap-y-6 text-center;

        border: var(--border-color, #343434) solid 1px;
        border-radius: 30px;
        padding: 2rem;
        background-color: var(--card-color);
        border-radius: 20px;
    }
}
</style>
