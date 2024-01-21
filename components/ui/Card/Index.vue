<template>
    <div class="card">
        <slot />
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.card {
    background-color: var(--card-color);
    border-radius: 30px;
    padding: 0.625rem 1rem;
    border: 1px solid #44a9b4;
}
</style>
