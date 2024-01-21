<template>
    <input
        ref="input"
        type="number"
        v-bind="{ ...$attrs, class: '', style: '', ...$props }"
        class="rounded-xl p-1.5 pl-2 font-h4"
        :style="{
            '--bg-color': bgColor,
            '--outline-color': outlineColor,
            '--focus': focusOutlineColor,
            '--font-color': fontColor
        }"
        :autocomplete="autocomplete"
        @input="manageInput"
        @change="manageChange"
        @keydown.esc.stop="input?.blur()"
    />
</template>

<script lang="ts" setup>
defineProps({
    modelValue: {
        type: Number,
        required: true
    },

    textAlign: {
        type: String as PropType<'left' | 'center' | 'right'>,
        default: 'left'
    },
    autocomplete: {
        type: String as PropType<AutoComplete>,
        default: 'off'
    },

    bgColor: {
        type: String as PropType<CssColors>,
        default: 'var(--background)'
    },
    outlineColor: {
        type: String as PropType<CssColors>,
        default: 'var(--primary)'
    },
    focusOutlineColor: {
        type: String as PropType<CssColors>,
        default: 'var(--accent)'
    },
    fontColor: {
        type: String as PropType<CssColors>,
        default: 'var(--text)'
    }
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: string): void;
    (event: 'change:modelValue', value: string): void;
}>();

const input = ref<HTMLInputElement>();

function manageInput(event: Event) {
    const target = event?.target as HTMLInputElement;
    emits('update:modelValue', target?.value);
}

function manageChange(event: Event) {
    const target = event?.target as HTMLInputElement;
    emits('change:modelValue', target?.value);
}
</script>

<style lang="scss" scoped>
input {
    &:focus {
        outline: 2px solid var(--focus);
    }

    outline: 2px solid var(--outline-color);
    outline-offset: -1px;
    background: var(--bg-color, white);
    color: var(--font-color, white);

    -moz-appearance: textfield;
    appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &::placeholder {
        color: var(--outline-color);
    }

    &:disabled {
        background-color: var(--disabled-bg-color, var(--outline-color));
        outline-color: var(--disabled-outline-color, var(--outline-color));
        color: var(--disabled-font-color, white);
    }
}
</style>
