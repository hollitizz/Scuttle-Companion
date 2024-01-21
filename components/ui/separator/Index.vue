<template>
    <div class="w-full">
        <div class="gradient"></div>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.gradient {
    margin: 0 auto;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%);
}
</style>
