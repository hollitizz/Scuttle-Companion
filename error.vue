<template>
    <div class="error">
        <h1>Il semble y avoir eu une erreur</h1>
        <UiFormButton @click="() => $router.push('/')">
            Retour à l'accueil
        </UiFormButton>
    </div>
</template>

<script setup>
const props = defineProps({ error: Object });
</script>

<style lang="scss" scoped>
.error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 3rem;
}
</style>
