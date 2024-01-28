<template>
    <div>
        <UiNavbarComponents ref="navbar" :items="useSettingsNavbar" />
        <component
            v-if="navbar?.componentToDisplay"
            :is="navbar.componentToDisplay"
        />
    </div>
</template>

<script lang="ts" setup>
import UiNavbarComponents from '@/components/ui/navbar/Components.vue';

const navbar = ref(null as null | InstanceType<typeof UiNavbarComponents>);
</script>

<style lang="scss" scoped></style>
