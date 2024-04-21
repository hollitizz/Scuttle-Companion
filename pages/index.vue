<template>
    <div class="h-full w-full flex flex-col relative">
        <UiModalConfirm v-model:is-open="isAskingMigrate" @yes="migrateOldConf">
            <template #information>
                Une ancienne configuration a été détectée
            </template>
            <template #question> Voulez-vous la restaurer ? </template>
        </UiModalConfirm>

        <template v-if="isEncrypted && !accounts">
            <div class="h-full w-full flex-center">
                <form
                    @submit.prevent="login"
                    class="h-full w-[30rem] flex-center flex-col text-center gap-4"
                >
                    <h2 class="flex-1 flex items-end">
                        Tes comptes sont encrypté, rentre ton mot de passe afin
                        de pouvoir les utiliser
                    </h2>

                    <UiFormInput
                        class="w-[20rem]"
                        v-model="password"
                        type="password"
                        placeholder="Mot de passe"
                    />

                    <div class="flex-1"></div>
                </form>
            </div>
        </template>

        <template v-else>
            <AccountList />
        </template>
    </div>
</template>

<script lang="ts" setup>
const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);

const accountsStore = useAccountsStore();
const { accounts, password, isEncrypted, connectedAccount, lastConnectedId } =
    storeToRefs(accountsStore);

const lcuStore = useLcuStore();

async function refreshConnectedAccount() {
    const account = await lcuStore.getConnectedAccountInfo();

    if (!account.success || !accounts.value) {
        connectedAccount.value = null;
        return false;
    }

    const current_account = accounts.value.find(
        a => a.id === account.data!.summonerId || a.id === lastConnectedId.value
    );

    if (!current_account || !account.data) return false;

    connectedAccount.value = current_account;
    connectedAccount.value.id = account.data.summonerId;
    connectedAccount.value.summoner_level = account.data.summonerLevel;
    connectedAccount.value.icon_id = account.data.profileIconId;
    connectedAccount.value.summoner_name = account.data.gameName;
    connectedAccount.value.tag = '#' + account.data.tagLine;

    accountsStore.saveAccounts();
    return true;
}

const APITier = [
    '',
    'IRON',
    'BRONZE',
    'SILVER',
    'GOLD',
    'PLATINUM',
    'EMERALD',
    'DIAMOND',
    'MASTER',
    'GRANDMASTER',
    'CHALLENGER'
];
const APIRank = ['NA', 'I', 'II', 'III', 'IV'];

async function refreshRankedData() {
    if (!connectedAccount.value) return;

    const rankedData = await lcuStore.getSummonerRankedStats();

    if (!rankedData.success || !rankedData.data) return;

    const soloq_data = rankedData.data.queueMap.RANKED_SOLO_5x5;
    connectedAccount.value.tier = APITier.findIndex(
        tier => tier === soloq_data.tier
    );
    connectedAccount.value.rank = APIRank.findIndex(
        rank => rank === soloq_data.division
    );
    connectedAccount.value.lp = 0;
    connectedAccount.value.wins = soloq_data.wins;
    connectedAccount.value.losses = soloq_data.losses;
    connectedAccount.value.is_provisional = soloq_data.isProvisional;
    accountsStore.saveAccounts();
}

function startJobs() {
    setInterval(async () => {
        if (!(await refreshConnectedAccount())) return;
        refreshRankedData();
    }, 1000 * 3);
}

useMountedFetch(() => {
    if (!settings.value) settingsStore.loadSettings();

    if (!settings.value?.isEncrypted ?? false) {
        accountsStore.loadAccounts();
        startJobs();
    } else isEncrypted.value = true;
});

function login() {
    if (settingsStore.checkPassword(password.value)) {
        accountsStore.loadAccounts();
        startJobs();
    }
}

const isAskingMigrate = ref(false);

function migrateOldConf() {
    settingsStore.migrateOldConf();
    settingsStore.loadSettings();
    accounts.value = null;
    if (settings.value?.isEncrypted) isEncrypted.value = true;
}

useEventBus.on('ask_migrate_old_conf', () => {
    isAskingMigrate.value = true;
});
</script>
