<template>
    <div
        ref="card"
        class="absolute z-10 top-3 left-1/2 translate-x-1/3 rounded-lg shadow-lg overflow-hidden"
    >
        <UiCard
            class="rounded-sm relative w-[187px] h-[214px] shadow-md isolate"
            padding="0px"
            radius="8px"
        >
            <div
                class="relative flex justify-center items-center gap-2 py-2 px-0 mx-2 my-0"
            >
                <div class="flex items-center gap-1">
                    <img src="~/assets/img/RP_icon.webp" class="w-4" alt="RP" />
                    <p class="p-0 m-0">
                        {{ formatBigNumber(account.wallet?.rp) }}
                    </p>
                </div>

                <div class="flex items-center gap-1">
                    <img src="~/assets/img/BE_icon.webp" class="w-4" alt="BE" />
                    <p class="p-0 m-0">
                        {{ formatBigNumber(account.wallet?.be) }}
                    </p>
                </div>

                <button
                    type="button"
                    @click="toggleSearch"
                    class="absolute right-1 hover:scale-110 scale:scale-105 transition z-10 w-5 h-5 top-2"
                    aria-label="Search champions"
                >
                    <img src="~/assets/svg/find.svg" alt="find" class="m-0.5" />
                </button>

                <template v-if="isSearching">
                    <UiFormInputText
                        ref="searchInput"
                        v-model="search"
                        type="text"
                        name="search"
                        id="search"
                        class="absolute w-full top-1"
                        placeholder="Search champion..."
                        @keydown.esc="closeSearch"
                    />
                </template>
            </div>

            <ul
                :class="[
                    'h-[calc(100%-2rem)] min-w-[calc(2.5rem*4+0.25rem*3+0.5rem)]',
                    'grid grid-cols-4 p-1 pr-0 gap-1 list-none overflow-y-auto'
                ]"
            >
                <li
                    v-for="champName in filteredChampions"
                    :key="champName"
                    class="w-10 h-10"
                >
                    <img
                        :src="getPathOf(champName)"
                        :alt="champName"
                        class="w-10 h-10 rounded"
                    />
                </li>
            </ul>
        </UiCard>
    </div>
</template>

<script lang="ts" setup>
const emits = defineEmits(['close']);
const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    }
});

const card = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const search = ref('');
const isSearching = ref(false);

watch(search, val => {
    isSearching.value = val.length > 0 || isSearching.value;
});

function formatBigNumber(n: number = 0) {
    if (n < 100_000) return n;
    if (n < 1_000_000) return `${Math.floor(n / 1_000)}K`;
    if (n < 1_000_000_000) return `${Math.floor(n / 1_000_000)}M`;
    return `${Math.floor(n / 1_000_000_000)}B`;
}

function getPathOf(champName: string) {
    return `${process.env['RESOURCES_FOLDER']}championTiles/${champName}.png`;
}

function toggleSearch() {
    isSearching.value = !isSearching.value;
    if (isSearching.value) {
        nextTick(() => searchInput.value?.focus());
    } else {
        closeSearch();
    }
}

function closeSearch() {
    search.value = '';
    isSearching.value = false;
}

const filteredChampions = computed(() => {
    const champs = props.account.champions || [];
    if (!search.value) return champs;
    return champs.filter(champ =>
        champ.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
    );
});

function handleClick(e: MouseEvent) {
    const button = document.getElementById(`${props.account.id}`);
    if (
        card.value &&
        !card.value.contains(e.target as Node) &&
        !button?.contains(e.target as Node)
    ) {
        emits('close');
    }
}

function handleEscape(e: KeyboardEvent) {
    if (e.key === 'Escape') {
        if (isSearching.value) {
            closeSearch();
        } else {
            emits('close');
        }
    }
}

onMounted(() => {
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
    document.removeEventListener('mousedown', handleClick);
    document.removeEventListener('keydown', handleEscape);
});
</script>
