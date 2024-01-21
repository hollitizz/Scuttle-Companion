<template>
    <div class="wrapper">
        <div class="card">
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.wrapper {
    padding: 0.0625rem;
    background: linear-gradient(160deg, var(--accent) 0%, #343434 50%);
    border-radius: 30px;

    .card {
        background-color: var(--card-color);
        border-radius: 30px;
        padding: 0.625rem 1rem;
    }
}
</style>
