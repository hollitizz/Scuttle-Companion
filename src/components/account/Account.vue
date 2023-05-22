<template>
    <div class="account" >
        <AccountElo class="w-full" :account="account" />
        <AccountName class="w-full name" :account="account" :imgKey="nameKey" :isLogged="isLogged" />
        <AccountActions
            :account="account"
            :isEditMode="isEditMode"
            class="w-full"
            @delete:account="handleDelete"
            @login:success="updateAccount"
        />
    </div>
</template>
<script setup lang="ts">
import { PropType, computed, onMounted, ref, watch } from 'vue';
import { Account } from '../../types';
import AccountElo from './Elo.vue';
import AccountName from './Name.vue';
import AccountActions from './Actions.vue';
import { useLeagueLCUAPI } from '../../utils/LeagueLCU';
import { RankedStats } from '../../types';
import { ipcRenderer } from 'electron';

const { getCurrentSummonerRankedData, getSummonerInfo, checkIsLoggedIn, getOwnedChampions } =
    useLeagueLCUAPI();

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
    try {
        summoner = await getSummonerInfo();
        rankedStats = await getCurrentSummonerRankedData();
        champions = await getOwnedChampions();
    } catch (error) {
        return;
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
}

.mx-auto {
    margin-left: auto;
    margin-right: auto;
}

.w-full {
    width: 100%;
}
</style>
