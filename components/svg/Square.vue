<template>
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M7 25H25"
            :stroke="color"
            stroke-width="2"
            stroke-linecap="round"
        />
        <path
            d="M25 25V7"
            :stroke="color"
            stroke-width="2"
            stroke-linecap="round"
        />
        <path
            d="M7 25L7 7"
            :stroke="color"
            stroke-width="2"
            stroke-linecap="round"
        />
        <path
            d="M7 7H25"
            :stroke="color"
            stroke-width="2"
            stroke-linecap="round"
        />
    </svg>
</template>

<script setup lang="ts">
const props = defineProps({
    color: { type: String, default: 'white' }
});
</script>
