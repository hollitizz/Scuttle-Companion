<template>
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        :fill="color"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g filter="url(#filter0_d_550_3)">
            <path
                d="M7 16H25"
                :stroke="color"
                stroke-width="2"
                stroke-linecap="round"
            />
        </g>
    </svg>
</template>

<script setup lang="ts">
const props = defineProps({
    color: { type: String, default: 'white' }
});
</script>
