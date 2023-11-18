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
        <defs>
            <filter
                id="filter0_d_550_3"
                x="-4"
                y="0"
                width="40"
                height="40"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_550_3"
                />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_550_3"
                    result="shape"
                />
            </filter>
        </defs>
    </svg>
</template>

<script setup lang="ts">
const props = defineProps({
    color: { type: String, default: 'white' }
});
</script>
