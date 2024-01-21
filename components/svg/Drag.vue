<template>
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M6 24H16H26"
            :stroke="color"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M6 16H16H26"
            :stroke="color"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M6 8H16H26"
            :stroke="color"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</template>
<script setup lang="ts">
const props = defineProps({
    color: { type: String, default: 'var(--accent)' }
});
</script>
