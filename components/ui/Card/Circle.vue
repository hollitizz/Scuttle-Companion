<template>
    <div
        class="wrapper"
        :style="{
            '--border-color': borderColor,
            '--background-color': backgroundColor
        }"
    >
        <div class="card">
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps({
    borderColor: {
        type: String as PropType<CssColors>,
        default: '#343434'
    },
    backgroundColor: {
        type: String as PropType<CssColors>,
        default: 'var(--card-color)'
    }
});
</script>

<style lang="scss" scoped>
.wrapper {
    padding: 0.0625rem;
    background: var(--border-color, #343434);
    border-radius: 9999px;

    .card {
        width: 100%;
        height: 100%;
        background-color: var(--background-color);
        border-radius: 9999px;
    }
}
</style>
