<template>
    <div class="card">
        <slot />
    </div>
</template>
<style lang="scss" scoped>
.card {
    background-color: var(--secondary);
    box-shadow: 0 0 4px 5px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    padding: 0.5rem;
    height: 100%;
    width: 100%;
}
</style>