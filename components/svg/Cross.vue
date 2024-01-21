<template>
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M26.0001 26L16.0001 16M16.0001 16L6.00006 6M16.0001 16L26.0001 6M16.0001 16L6.00006 26"
            :stroke="color"
            stroke-width="3"
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
