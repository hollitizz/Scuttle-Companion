<template>
    <AccountAddModal v-model:isOpen="isOpen" />

    <li>
        <UiFormButton
            v-tooltip="'Ajouter un compte'"
            @click="isOpen = true"
            :small="true"
        >
            <SvgAdd class="w-6 h-6" />
        </UiFormButton>
    </li>
    <li>
        <UiFormButton
            v-tooltip="'Modifier les comptes'"
            :small="true"
            @click="emits('toggle:editMode')"
        >
            <SvgEdit class="w-6 h-6" />
        </UiFormButton>
    </li>
</template>

<script lang="ts" setup>
const isOpen = ref(false);

const emits = defineEmits<{
    (e: 'toggle:editMode'): void;
}>();
</script>

<style lang="scss" scoped></style>
