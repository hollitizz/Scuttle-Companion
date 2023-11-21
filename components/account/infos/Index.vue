<template>
    <div class="h-full flex-center flex-col items-center">
        <div class="flex-center flex-col select-none">
            <img class="icon" v-if="icon" :src="icon" alt="icon" />
            <h4 class="level">
                <h3>{{ account.summoner_level }}</h3>
            </h4>
        </div>
        <h2 class="text-2xl">{{ account.summoner_name }}</h2>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    }
});

const icon = ref(null as string | null);
onMounted(async () => {
    icon.value = await useResolveIcon(props.account.icon_id);
});
</script>

<style lang="scss" scoped>
.icon {
    @apply h-24 rounded-3xl;
}

.level {
    margin-top: -15px;
    margin-bottom: -5px;
    border-radius: 10px;
    background-color: var(--primary);
    outline-offset: -2px;
    outline: solid 4px var(--card-color);

    h3 {
        padding: 5px;
        border-radius: 10px;
        outline: solid 4px var(--background);
        outline-offset: -2px;
    }
}
</style>
