<template>
    <AccountAddAccount
        v-if="isAddingAccount"
        @add:account="addAccount"
        v-model="isAddingAccount"
    />
    <Settings
        v-if="isSettingsOpen"
        v-model="isSettingsOpen"
        :accounts="accounts"
        @update:encryption="changeEncryption"
        @add:accounts="importAccounts"
        @update:leaguePath="updateLeaguePath"
    />
    <div class="buttons">
        <UiButton v-tooltip="'Paramètres'" @click="openSettings" class="button">
            <img src="../assets/svg/settings.svg" alt="edit" />
        </UiButton>
        <UiButton
        v-tooltip="
                `${!isEditMode ? 'Activer' : 'Desactiver'} le mode édition`
            "
            @click="editAccounts"
            class="button"
            >
            <img src="../assets/svg/edit.svg" alt="edit" />
        </UiButton>
        <UiButton
            v-if="isValidPath"
            v-tooltip="'Lancer League'"
            @click="openLeague"
            class="button"
        >
            <img src="../assets/svg/league.svg" alt="league" />
        </UiButton>
        <UiButton
            v-tooltip="'Ajouter un compte'"
            @click="isAddingAccount = true"
            class="button"
        >
            <img src="../assets/svg/add.svg" alt="add" />
        </UiButton>
    </div>
    <AccountAccounts
        class="main"
        :isEditMode="isEditMode"
        :accounts="accounts"
        @update:accounts="accountStore.moveAccount"
        @delete:account="deleteAccount"
        @update:account="updateAccount"
    />
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAccountStore } from '../store/AccountsManager';
import AccountAccounts from './account/Accounts.vue';
import UiButton from './ui/Button.vue';
import AccountAddAccount from './account/AddAccount.vue';
import Settings from './Settings.vue';
import { storeToRefs } from 'pinia';
import { useAlerts } from '../utils/Alerts';
import { Account } from '../types';
import { spawn } from 'child_process';

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    isEncrypted: {
        type: Boolean,
        required: true
    }
});

const isEditMode = ref(false);
const isAddingAccount = ref(false);
const isSettingsOpen = ref(false);
const { success, error } = useAlerts();
const accountStore = useAccountStore();
const { accounts, password, isEncrypted } = storeToRefs(accountStore);

if (props.isEncrypted) {
    password.value = props.modelValue;
    isEncrypted.value = props.isEncrypted;
}

const isValidPath = ref(process.env['LEAGUE_EXECUTABLE'] !== '');

function updateLeaguePath() {
    isValidPath.value = process.env['LEAGUE_EXECUTABLE'] !== '';
}

accountStore.loadAccounts();

function editAccounts() {
    isEditMode.value = !isEditMode.value;
}

function openSettings() {
    isSettingsOpen.value = true;
}

watch(isEncrypted, () => {
    if (isEncrypted.value) {
        accountStore.loadAccounts();
    }
});

function updateAccount(from: Account, to: Account) {
    accountStore.updateAccount(from, to);
}

function addAccount(account: Account) {
    accountStore.addAccount(account);
    success(`Le compte "${account.summoner_name}" a bien été ajouté !`);
}

function deleteAccount(account: Account) {
    accountStore.deleteAccount(account);
    success(`Le compte "${account.summoner_name}" a bien été supprimé !`);
}

function importAccounts(accounts: Account[]) {
    accountStore.importAccounts(accounts);
    success(`Les comptes ont été correctement importé !`);
}

function openLeague() {
    if (!process.env['LEAGUE_EXECUTABLE']) {
        error('Impossible de lancer League of Legends');
        return;
    }
    try {
        if (process.platform === 'win32') {
            spawn('cmd.exe', ['/c', 'start', process.env['LEAGUE_EXECUTABLE']]);
        } else if (process.platform === 'darwin') {
            spawn('open', [process.env['LEAGUE_EXECUTABLE']]);
        }
        success('League of Legends lancé !');
    } catch (e) {
        error('Impossible de lancer League of Legends');
    }
}

function changeEncryption(isEncrypt: boolean, pass: string) {
    password.value = pass;
    isEncrypted.value = isEncrypt;
    accountStore.saveAccounts();
}
</script>
<style lang="scss" scoped>
.main {
    height: 100%;
    width: 100%;
}

.buttons {
    position: absolute;
    right: 4rem;
    top: 3.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    .button {
        padding: 0;
        right: 3.5rem;
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
