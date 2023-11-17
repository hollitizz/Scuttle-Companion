<template>
    <UiModal
        @close="emits('update:modelValue', false)"
        width="50rem"
        height="40rem"
    >
        <div class="settings-content">
            <h1 class="text-center title">Paramètres</h1>
            <UiCardsRectangle class="imports">
                <h2 class="text-center title">Importer / Exporter</h2>
                <div class="buttons">
                    <UiButton @click="importAccounts"
                        >Importer des comptes</UiButton
                    >
                    <UiButton @click="exportAccounts"
                        >Exporter des comptes</UiButton
                    >
                </div>
            </UiCardsRectangle>
            <UiCardsRectangle class="security">
                <h2 class="text-center title">Sécurité</h2>
                <div class="buttons">
                    <UiButton @click="handleEncryptionButton"
                        >{{
                            settings.isEncrypted ? 'Désactiver' : 'Activer'
                        }}
                        le chiffrement</UiButton
                    >
                </div>
            </UiCardsRectangle>
            <UiCardsRectangle v-if="settings.isEncrypted" class="passwords">
                <h2 class="title text-center">Mot de passe</h2>
                <div class="config">
                    <UiInputPassword
                        v-model="oldPassword"
                        label="Ancien mot de passe"
                    />
                    <UiInputPassword
                        v-model="newPassword"
                        label="Nouveau mot de passe"
                    />
                    <UiInputPassword
                        v-model="newPasswordConfirm"
                        label="Confirmer le nouveau mot de passe"
                    />
                    <UiButton @click="changePassword"
                        >Changer le mot de passe</UiButton
                    >
                </div>
            </UiCardsRectangle>

            <UiCardsRectangle class="league-settings">
                <h2 class="title text-center">
                    Paramètres de League of Legend
                </h2>
                <div class="buttons">
                    <UiButton @click="saveLeagueSettings"
                        >Sauvegarder les paramètres</UiButton
                    >
                    <UiButton
                        v-if="settings.leagueSettings?.inputSettings"
                        @click="applyLeagueSettings"
                        >Appliquer au compte actuel</UiButton
                    >
                </div>
            </UiCardsRectangle>

            <UiCardsRectangle class="path">
                <h2 class="title text-center">Chemins d'applications</h2>
                <div class="flex">
                    <div>
                        <p>Raccourci League of Legends</p>
                        <UiInputText
                            v-model="leagueLockfilePath"
                            :label="
                                !leagueLockfilePathValid
                                    ? `Ressemble à : 'C:/Riot Games/League of Legends'`
                                    : ''
                            "
                            maxWidth="100%"
                            :borderColor="
                                leagueLockfilePathValid
                                    ? 'var(--green)'
                                    : 'var(--red)'
                            "
                            @enter="changePath"
                        >
                        </UiInputText>
                    </div>
                </div>

                <div class="flex">
                    <div>
                        <p>Chemin d'installation de League of Legends</p>
                        <UiInputText
                            v-model="leagueExecPath"
                            :label="
                                !leagueExecPathValid
                                    ? `Ressemble à : 'C:/Riot Games/Riot Client/RiotClientServices.exe'`
                                    : ''
                            "
                            maxWidth="100%"
                            :borderColor="
                                leagueExecPathValid
                                    ? 'var(--green)'
                                    : 'var(--red)'
                            "
                            @enter="changePath"
                        >
                        </UiInputText>
                    </div>
                    <div class="button">
                        <UiButton @click="changePath"> Valider </UiButton>
                    </div>
                </div>
            </UiCardsRectangle>
        </div>
    </UiModal>
    <SetPassword
        v-if="isSettingPassword"
        v-model="isSettingPassword"
        @set:password="setPassword"
    />
    <AskPassword
        v-if="isAskingPassword"
        v-model="isAskingPassword"
        @send:password="disableEncryption"
    />
    <Transition name="pop" appear>
        <UiInputConfirm
            v-if="isWaitingConfirm"
            @cancel="confirmCallback(false)"
            @validate="confirmCallback(true)"
            :text="confirmText"
        />
    </Transition>
</template>

<script setup lang="ts">
import UiModal from './ui/Modal.vue';
import UiButton from './ui/input/Button.vue';
import UiInputPassword from './ui/input/Password.vue';
import UiCardsRectangle from './ui/cards/Rectangle.vue';
import SetPassword from './SetPassword.vue';
import AskPassword from './AskPassword.vue';
import UiInputText from './ui/input/Text.vue';
import UiInputConfirm from './ui/input/Confirm.vue';
import { useSettingsStore } from '../store/Settings';
import { storeToRefs } from 'pinia';
import { PropType, computed, ref } from 'vue';
import { Account } from '../types';
import { ipcRenderer } from 'electron';
import { useAlerts } from '../utils/Alerts';
import fs from 'fs';
import { useLeagueLCUAPI } from '../utils/LeagueLCU';
import { useToast } from 'vue-toastification';

const settingsStore = useSettingsStore();
settingsStore.loadSettings();
const { settings } = storeToRefs(settingsStore);
const { getSummonerSettings, patchSummonerSettings } = useLeagueLCUAPI();

const { success, info } = useAlerts();

const isWaitingConfirm = ref(false);
const confirmText = ref('');
const confirmCallback = ref((e: boolean) => {});

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    accounts: {
        type: Array as PropType<Account[]>,
        required: true
    }
});

const emits = defineEmits([
    'update:modelValue',
    'update:encryption',
    'add:accounts',
    'update:leaguePath'
]);
const isSettingPassword = ref(false);
const isAskingPassword = ref(false);

const oldPassword = ref('' as string);
const newPassword = ref('' as string);
const newPasswordConfirm = ref('' as string);
const leagueExecPath = ref(process.env['LEAGUE_EXECUTABLE'] as string);
const leagueLockfilePath = ref(process.env['LEAGUE_LOCKFILE'] as string);

const leagueExecPathValid = computed(() => {
    return process.env['LEAGUE_EXECUTABLE'] !== '';
});
const leagueLockfilePathValid = computed(
    () => process.env['LEAGUE_LOCKFILE'] !== ''
);

function importAccounts() {
    ipcRenderer.send('import-accounts');
    ipcRenderer.on('import-accounts-reply', (event, accounts) => {
        emits('add:accounts', accounts);
    });
}

function exportAccounts() {
    ipcRenderer.send(
        'export-accounts',
        JSON.stringify(props.accounts, null, 4)
    );
    ipcRenderer.on('export-accounts-reply', event => {
        success('Les comptes ont bien été exportés !');
    });
}

function setPassword(password: string) {
    settingsStore.setPassword(password);
    emits('update:encryption', true, password);
    success('Le mot de passe a bien été défini !');
}

async function saveLeagueSettings() {
    const summonerSettings = await getSummonerSettings();

    if (settings.value.leagueSettings?.inputSettings) {
        isWaitingConfirm.value = true;
        confirmText.value =
            'Voulez-vous vraiment écraser les paramètres actuels ?';
        confirmCallback.value = e => {
            if (e) {
                settingsStore.setLeagueSettings(summonerSettings);
                success('Les paramètres ont bien été sauvegardés !');
            } else {
                info("Les paramètres n'ont pas été sauvegardés !");
            }
            isWaitingConfirm.value = false;
        };
    } else {
        settingsStore.setLeagueSettings(summonerSettings);
        success('Les paramètres ont bien été sauvegardés !');
    }
}

async function applyLeagueSettings() {
    if (!settings.value.leagueSettings) {
        throw new Error(
            'Les paramètres de League of Legends sont introuvables'
        );
    }
    await patchSummonerSettings(settings.value.leagueSettings);

    success('Les paramètres ont bien été appliqués !');
}

function handleEncryptionButton() {
    if (!settings.value.isEncrypted) {
        isSettingPassword.value = true;
    } else {
        isAskingPassword.value = true;
    }
}

function changePassword() {
    if (newPassword.value !== newPasswordConfirm.value) {
        throw new Error('Les nouveaux mots de passe ne correspondent pas');
    }
    settingsStore.changePassword(oldPassword.value, newPassword.value);
    success('Le mot de passe a bien été changé !');
}

function disableEncryption(password: string) {
    settingsStore.deletePassword(password);
    emits('update:encryption', false);
    success('Le chiffrement a été désactivé !');
}

function changePath() {
    if (leagueExecPath.value !== process.env['LEAGUE_EXECUTABLE']) {
        if (fs.existsSync(leagueExecPath.value)) {
            settingsStore.setLeaguePath(leagueExecPath.value);
            emits('update:leaguePath');
            success("Le chemin d'accès a bien été changé !");
        } else
            useToast().error(
                "Le chemin de raccourci de League of Legends n'est pas valide"
            );
    }

    if (leagueLockfilePath.value !== process.env['LEAGUE_LOCKFILE']) {
        if (fs.existsSync(leagueLockfilePath.value)) {
            if (
                leagueLockfilePath.value.charAt(
                    leagueLockfilePath.value.length - 1
                ) === '/'
            ) {
                leagueLockfilePath.value = leagueLockfilePath.value.slice(
                    0,
                    leagueLockfilePath.value.length - 1
                );
            }
            settingsStore.setLeagueLockPath(leagueLockfilePath.value);
            success("Le chemin d'accès a bien été changé !");
        } else
            useToast().error(
                "Le chemin d'installation League of Legends n'est pas valide"
            );
    }
}
</script>

<style lang="scss" scoped>
.settings-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    .title {
        margin: 0;
    }
    .imports {
        position: relative;
        width: 80%;
        height: 7rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        .title {
            margin: 0;
        }

        .buttons {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }
    }

    .security {
        position: relative;
        width: 80%;
        height: 7rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        .title {
            margin: 0;
        }

        .buttons {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }
    }

    .passwords {
        position: relative;
        width: 80%;
        height: 23rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        .config {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }
    }
    .path {
        position: relative;
        width: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        .title {
            margin: 0;
        }

        .flex {
            // display: flex;
            justify-content: center;
            align-items: end;
            gap: 2rem;
            width: 80%;

            p {
                width: 100%;
                font-size: medium;
                font-weight: 500;
                text-align: center;
                margin: 0;
            }

            .button {
                button {
                    width: 6rem;
                }
                width: 100%;
                margin-top: 5px;
                margin-bottom: 5px;
                display: flex;
                justify-content: center;
                height: 2.5rem;
            }
        }
    }

    .league-settings {
        position: relative;
        width: 80%;
        height: auto;
        .title {
            margin: 0;
        }
        .buttons {
            margin-top: 0.5rem;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            gap: 0.5rem;
        }
    }
}
</style>
