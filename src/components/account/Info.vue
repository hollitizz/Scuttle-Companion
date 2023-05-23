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
            </div>
            <ul class="champ-list">
                <li v-for="champName in account.champions">
                    <img :src="getPathOf(champName)" alt="champ" />
                </li>
            </ul>
        </UiCardsRectangle>
    </div>
</template>

<script lang="ts" setup>
import { Account } from '../../types';
import UiCardsRectangle from '../ui/cards/Rectangle.vue';
import { PropType, onMounted, onUnmounted, ref } from 'vue';

const card = ref(null as HTMLElement | null);
const emits = defineEmits(['close']);
const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    }
});

function formatBigNumber(n: number) {
    if (n < 100000) return n;
    if (n < 1000000) return `${Math.floor(n / 1000)}K`;
    if (n < 1000000000) return `${Math.floor(n / 1000000)}M`;
    return `${Math.floor(n / 1000000000)}B`;
}

const getPathOf = (champName: string) => {
    return `${process.env['RESOURCES_FOLDER']}championTiles/${champName}.png`;
};

onMounted(async () => {
    const button = document.getElementById(`${props.account.app_id}`);
    document.addEventListener('click', (e: MouseEvent) => {
        if (
            card.value &&
            !card.value.contains(e.target as Node) &&
            !button?.contains(e.target as Node)
        ) {
            emits('close');
        }
    });
});

onUnmounted(() => {
    document.removeEventListener('click', () => {});
});
</script>

<style lang="scss" scoped>
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
            padding: 0.5rem 0;
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
