<template>
    <div class="account">
        <AccountElo class="w-full" :account="account" />
        <AccountName
            class="w-full name"
            :account="account"
            :imgKey="nameKey"
            :isLogged="isLogged"
        />
        <AccountActions
            :account="account"
            :isEditMode="isEditMode"
            class="w-full"
            @delete:account="handleDelete"
            @login:success="updateAccount"
        />
        <div
            v-if="account.champions.length && isLoaded"
            :id="`${account.app_id}`"
            @click="infoIsOpen = !infoIsOpen"
            class="info-button"
        >
            <img src="../../assets/svg/info.svg" alt="info" />
        </div>
        <AccountInfo
            v-if="infoIsOpen"
            class="w-full"
            :account="account"
            @close="infoIsOpen = false"
        />
    </div>
</template>
<script setup lang="ts">
import { PropType, computed, onMounted, ref, watch } from 'vue';
import { Account } from '../../types';
import { useLeagueLCUAPI } from '../../utils/LeagueLCU';
import { RankedStats } from '../../types';
import { ipcRenderer } from 'electron';
import AccountElo from './Elo.vue';
import AccountName from './Name.vue';
import AccountActions from './Actions.vue';
import AccountInfo from './Info.vue';

const isLoaded = ref(false);

onMounted(() => {
    isLoaded.value = true;
});

const {
    getCurrentSummonerRankedData,
    getSummonerInfo,
    checkIsLoggedIn,
    getOwnedChampions,
    getSummonerWallet
} = useLeagueLCUAPI();

const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    },
    isEditMode: {
        type: Boolean,
        required: true
    }
});

const infoIsOpen = ref(false);
const account = ref<Account>(props.account);

const APITier = [
    'NONE',
    'IRON',
    'BRONZE',
    'SILVER',
    'GOLD',
    'PLATINUM',
    'DIAMOND',
    'MASTER',
    'GRANDMASTER',
    'CHALLENGER'
];

const APIRank = ['0', 'I', 'II', 'III', 'IV'];

const emits = defineEmits(['delete:account', 'update:account']);

const isEditMode = computed(() => {
    return props.isEditMode;
});

const isLogged = ref(false);
const nameKey = ref(0);

async function sleep(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

watch(isLogged, () => {
    if (isLogged) {
        ipcRenderer.on('download-image-reply', async () => {
            await sleep(1);
            nameKey.value++;
        });
    }
});

watch(() => props.account, () => {
    account.value = props.account;
});

let runningInterval: NodeJS.Timer | null = null;

onMounted(async () => {
    const res = await checkIsLoggedIn(account.value.id);
    if (res) {
        updateAccount();
    }
    isLogged.value = res;
});

function checkStillLoggedIn() {
    if (runningInterval) clearInterval(runningInterval);
    runningInterval = setInterval(async () => {
        isLogged.value = await checkIsLoggedIn(account.value.id);
        if (!isLogged.value) return;
        updateAccount();
    }, 10000);
}

async function updateAccount() {
    let summoner = null;
    let rankedStats = {} as RankedStats;
    let champions = [] as string[];
    let wallet = {} as { rp: number; be: number };
    try {
        summoner = await getSummonerInfo();
        rankedStats = await getCurrentSummonerRankedData();
        wallet = await getSummonerWallet();
    } catch (error) {
        return;
    }
    try {
        champions = await getOwnedChampions();
    } catch (error) {
        champions = account.value.champions;
    }
    const to: Account = {
        ...account.value,
        id: summoner.id,
        summoner_level: summoner.level,
        icon_id: summoner.iconId,
        summoner_name: summoner.summoner_name,
        tier: APITier.findIndex(tier => tier === rankedStats.tier),
        rank: APIRank.findIndex(rank => rank === rankedStats.division),
        lp: rankedStats.leaguePoints,
        wins: rankedStats.wins,
        losses: rankedStats.losses,
        is_provisional: rankedStats.isProvisional,
        wallet,
        champions
    };
    emits('update:account', account.value, to);
    isLogged.value = true;
    checkStillLoggedIn();
    account.value = to;
}

function handleDelete(account: Account) {
    emits('delete:account', account);
}

watch(isLogged, () => {
    if (isLogged.value) {
        checkStillLoggedIn();
    } else {
        if (runningInterval) {
            clearInterval(runningInterval);
            runningInterval = null;
        }
    }
});
</script>
<style lang="scss" scoped>
.account {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    width: 100%;
    padding: 0;
    h2 {
        margin: 0;
        padding: 0;
    }
    .info-button {
        position: absolute;
        top: 0;
        right: 19rem;
        width: 32px;
        height: 32px;
        padding: 0;
        border-radius: 100%;
        background-color: var(--primary);
        z-index: 5;
        transition: all 0.1s ease-in-out;
        &:hover {
            transform: scale(1.1);
            cursor: pointer;
        }
        &:active {
            transform: scale(1.05);
        }
    }
}

.mx-auto {
    margin-left: auto;
    margin-right: auto;
}

.w-full {
    width: 100%;
}
</style>
