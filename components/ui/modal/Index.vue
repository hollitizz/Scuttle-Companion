<template>
    <div
        v-if="isOpen"
        ref="modal"
        class="modal cursor-pointer"
        @click="closeModal"
    >
        <div class="content cursor-auto" @click.stop>
            <slot />
        </div>
    </div>
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
}>();

onMounted(() => {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});

onUnmounted(() => {
    document.removeEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
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
        border: var(--border-color, #343434) solid 1px;
        border-radius: 30px;
        padding: 2rem;
        background-color: var(--card-color);
        border-radius: 20px;
    }
}
</style>
