<template>
    <nav class="p-2">
        <ul class="flex gap-2">
            <li
                v-for="(item, index) of items"
                class="navbar-item"
                :class="{
                    selected: index === selectedIndex
                }"
            >
                <div @click="selectedIndex = index">
                    <h3 class="p-1">{{ item.name }}</h3>
                </div>
            </li>
        </ul>
    </nav>
</template>

<script lang="ts" setup>
const props = defineProps({
    items: {
        type: Object as PropType<NavItem[]>
    }
});

const componentToDisplay = computed(() => {
    return props.items?.at(selectedIndex.value)?.component;
});

defineExpose({
    componentToDisplay
});

const selectedIndex = ref(0);
</script>

<style lang="scss" scoped>
.navbar-item {
    cursor: pointer;
    border-radius: 0.5rem;
    transition: background-color 0.2s ease-in-out;

    &::after {
        content: '';
        margin: 0 auto;
        display: block;
        width: 0;
        height: 0.25rem;
        border-radius: 9999px 0;
        background: var(--secondary);
        transition: width 0.2s ease-in-out;
    }

    &:hover {
        &::after {
            width: 30%;
        }
    }

    &.selected {
        color: var(--text-primary);

        &::after {
            width: 100%;
        }
    }
}
</style>
