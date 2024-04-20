<template>
    <div
        v-if="isOpen"
        ref="modal"
        class="modal cursor-pointer"
        @click="closeModal"
        :class="{
            closing: closing
        }"
    >
        <div
            class="content cursor-auto"
            @click.stop
            :class="{
                opening: opening,
                closing: closing
            }"
        >
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

const opening = ref(false);
const closing = ref(false);

watch(
    () => props.isOpen,
    nValue => {
        if (nValue) {
            opening.value = true;
            setTimeout(() => {
                opening.value = false;
            }, 300);
        }
    }
);

onMounted(() => {
    if (props.isOpen) {
        opening.value = true;
        setTimeout(() => {
            opening.value = false;
        }, 300);
    }
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
    closing.value = true;
    setTimeout(() => {
        emits('update:isOpen', false);
        closing.value = false;
    }, 300);
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

.opening {
    animation: grow 0.3s;
}

.closing {
    animation: shrink 0.3s;
}
</style>
