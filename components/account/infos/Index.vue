<template>
    <div class="h-full flex-center flex-col relative">
        <div class="flex-1"></div>

        <div class="flex-center flex-col select-none relative">
            <div
                :id="`${account.id}`"
                @click="!!account.champions.length && emits('click:info')"
                :class="[
                    'absolute -right-2 -top-2 w-6 h-6 p-0.5 rounded-full overflow-hidden',
                    'bg-primary outline outline-4 outline-card-color z-10 cursor-pointer',
                    {
                        'transition-all hover:scale-110 active:scale-105':
                            !!account.champions.length,
                        'cursor-not-allowed after:bg-black/50 after:absolute after:inset-0 ':
                            !account.champions.length
                    }
                ]"
            >
                <img src="~/assets/svg/info.svg" />
            </div>

            <img
                class="icon"
                :class="{
                    'outline outline-2 outline-success':
                        account.id === connectedAccount?.id
                }"
                v-if="icon"
                :src="icon"
                alt="icon"
            />

            <h4 class="level">
                <h3>{{ account.summoner_level }}</h3>
            </h4>
        </div>

        <h2 class="text-2xl flex-1 mt-1">{{ account.summoner_name }}</h2>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    }
});

const emits = defineEmits(['click:info']);

const { connectedAccount } = storeToRefs(useAccountsStore());

const icon = ref(null as string | null);

watch(
    () => props.account.icon_id,
    async () => {
        if (!props.account.icon_id) return;
        icon.value = await useResolveIcon(props.account.icon_id);
    },
    { immediate: true }
);
</script>

<style lang="scss" scoped>
.icon {
    @apply h-24 rounded-3xl;
}

.level {
    margin-top: -13px;
    margin-bottom: -5px;
    border-radius: 10px;
    background-color: var(--primary);
    padding: 5px;
    outline-offset: -2px;
    outline: solid 4px var(--card-color);
}
</style>
