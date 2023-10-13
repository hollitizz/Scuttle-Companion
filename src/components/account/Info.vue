<template>
    <div ref="card" class="card">
        <UiCardsRectangle class="account-info">
            <div class="wallet">
                <p>
                    <img src="../../assets/img/RP_icon.webp" />{{
                        formatBigNumber(account.wallet.rp)
                    }}
                </p>
                <p>
                    <img src="../../assets/img/BE_icon.webp" />{{
                        formatBigNumber(account.wallet.be)
                    }}
                </p>
                <template v-if="isSearching">
                    <input
                        type="text"
                        name="search"
                        id="search"
                        ref="searchInput"
                        v-model="search"
                        @input="handleInput"
                    />
                </template>
                <img
                    src="../../assets/svg/find.svg"
                    alt="find"
                    class="find"
                    @click="handleFindClick"
                />
            </div>
            <ul class="champ-list">
                <li v-for="champName in filteredChampions" :key="champName">
                    <img :src="getPathOf(champName)" :alt="champName" />
                </li>
            </ul>
        </UiCardsRectangle>
    </div>
</template>

<script lang="ts" setup>
import { Account } from '../../types';
import UiCardsRectangle from '../ui/cards/Rectangle.vue';
import { PropType, computed, onMounted, onUnmounted, ref, watch } from 'vue';

const card = ref(null as HTMLElement | null);
const emits = defineEmits(['close', 'update:search']);
const searchInput = ref();

const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    },
    search: {
        type: String,
        required: true
    }
});

const isSearching = ref(props.search !== '');
const search = ref(props.search);

watch(
    () => props.search,
    () => {
        search.value = props.search;
    },
    { immediate: true }
);

function formatBigNumber(n: number) {
    if (n < 100000) return n;
    if (n < 1000000) return `${Math.floor(n / 1000)}K`;
    if (n < 1000000000) return `${Math.floor(n / 1000000)}M`;
    return `${Math.floor(n / 1000000000)}B`;
}

const getPathOf = (champName: string) => {
    return `${process.env['RESOURCES_FOLDER']}championTiles/${champName}.png`;
};

function handleFindClick() {
    isSearching.value = !isSearching.value;
    if (isSearching.value) {
        setTimeout(() => {
            if (searchInput.value) searchInput.value?.focus(), 50;
        });
    } else {
        emits('update:search', '');
    }
}

function handleInput(event: Event) {
    emits('update:search', (event.target as HTMLInputElement)?.value);
}

const filteredChampions = computed(() =>
    props.account.champions.filter(champ => {
        if (props.search !== '') isSearching.value = true;
        return champ
            .toLocaleLowerCase()
            .includes(props.search.toLocaleLowerCase());
    })
);

onMounted(async () => {
    const button = document.getElementById(`${props.account.app_id}`);
    document.addEventListener('mousedown', (e: MouseEvent) => {
        if (
            card.value &&
            !card.value.contains(e.target as Node) &&
            !button?.contains(e.target as Node)
        ) {
            emits('close');
        } else {
            if (searchInput.value && isSearching.value)
                searchInput.value?.focus();
        }
    });
    if (searchInput.value && isSearching.value) searchInput.value?.focus();

    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (isSearching.value) {
                emits('update:search', '');
                isSearching.value = false;
                return;
            }
            emits('close');
        }
    });
});

onUnmounted(() => {
    document.removeEventListener('click', () => {});
});
</script>

<style lang="scss" scoped>
input {
    position: absolute;
    outline: solid 2px var(--darker);
    border: none;
    border-radius: 8px;
    top: 10px;
    left: 50%;
    translate: -55%;
    padding: 2px 6px;
}

.card {
    position: absolute;
    top: 0.75rem;
    right: 1.5rem;
    background-color: var(--primary);
    border-radius: 0.5rem;
    .account-info {
        width: 15rem;
        height: 11rem;
        background-color: var(--primary);
        border-radius: 0.5rem;
        padding-top: 0;
        overflow-y: auto;
        .wallet {
            margin: 0;
            width: 100%;
            text-align: center;
            position: sticky;
            top: 0;
            padding: 0.5rem 0 0.4rem 0;
            background-color: var(--primary);
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.2rem;
            p {
                padding: 0;
                margin: 0;
            }
            img {
                width: 1rem;
                margin: 0 0.2rem;
                &.find {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    top: 10px;
                    right: 0px;
                    cursor: pointer;

                    &:hover {
                        transform: scale(1.1);
                    }
                    transition: all 0.1s ease-in-out;
                }
            }
        }
        .champ-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            list-style: none;
            padding: 0;
            margin: 0;
            flex-wrap: wrap;
            gap: 0.5rem;
            li {
                height: 2.5rem;
                width: 2.5rem;
            }
            img {
                width: 2.5rem;
                height: 2.5rem;
                margin: 0;
            }
        }
    }
}
</style>
