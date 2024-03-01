<template>
    <div class="h-full w-full flex flex-col relative">
        <UiModalConfirm v-model:is-open="isAskingMigrate">
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
        <template v-else> <AccountList /> </template>
    </div>
</template>

<script lang="ts" setup>
const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);
useMountedFetch(() => {
    if (!settings.value) settingsStore.loadSettings();
});

const accountsStore = useAccountsStore();
const { accounts, password, isEncrypted } = storeToRefs(accountsStore);

if (!settings.value?.isEncrypted ?? false) accountsStore.loadAccounts();
else isEncrypted.value = true;

function login() {
    if (settingsStore.checkPassword(password.value))
        accountsStore.loadAccounts();
}

const isAskingMigrate = ref(false);

useEventBus.on('ask_migrate_old_conf', () => {
    isAskingMigrate.value = true;
});
</script>
