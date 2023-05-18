<template>
    <div class="modal" @click="emits('cancel')">
        <div class="container" @click.stop :style="{width, height}">
            <h3 class="title text-center">{{ text }}</h3>
            <div class="buttons">
                <UiButton @click="emits('cancel')" variant="red">{{ textCancel }}</UiButton>
                <UiButton @click="emits('validate')" variant="primary">{{ textValidate }}</UiButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import UiButton from './Button.vue';

const emits = defineEmits(['cancel', 'validate']);

defineProps({
    text: {
        type: String,
        default: 'Est-tu sur de vouloir faire ca ?'
    },
    textValidate: {
        type: String,
        default: 'Oui'
    },
    textCancel: {
        type: String,
        default: 'Non'
    },
    width: {
        type: String,
        default: '20rem'
    },
    height: {
        type: String,
        default: '10rem'
    }
});


</script>

<style lang="scss" scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    .container {
        position: fixed;
        top: 50%;
        left: 50%;
        padding: 1rem;
        transform: translate(-50%, -50%);
        background-color: var(--primary);
        border-radius: 0.5rem;
        overflow-y: auto;
        z-index: 1001;
    }
    .buttons {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 1rem;
    }
}
</style>