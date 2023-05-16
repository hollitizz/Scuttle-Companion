import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Settings } from '../types';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { useAlerts } from '../utils/Alerts';

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref({} as Settings);
    const { success } = useAlerts();

    function loadSettings() {
        let file = null;
        try {
            file = fs.readFileSync(
                process.env['RESOURCES_FOLDER'] + 'config.lal',
                'utf-8'
            );
        } catch (e) {
            fs.writeFileSync(
                process.env['RESOURCES_FOLDER'] + 'config.lal',
                JSON.stringify(
                    { isFirstTime: true, isEncrypted: false, password: '' },
                    null,
                    4
                )
            );
            file = fs.readFileSync(
                process.env['RESOURCES_FOLDER'] + 'config.lal',
                'utf-8'
            );
        }
        settings.value = JSON.parse(file);
        if (!settings.value.isFirstTime) settings.value.isFirstTime = true;
        if (!settings.value.isEncrypted) settings.value.isEncrypted = false;
        if (!settings.value.password) settings.value.password = '';
        if (!process.env['LEAGUE_EXECUTABLE']) {
            if (settings.value.leagueExecutable)
                process.env['LEAGUE_EXECUTABLE'] =
                    settings.value.leagueExecutable;
            else {
                process.env['LEAGUE_EXECUTABLE'] = '';
                settings.value.leagueExecutable = '';
            }
        }
    }

    function saveSettings() {
        if (settings.value.isFirstTime) {
            settings.value.isFirstTime = false;
        }
        fs.writeFileSync(
            process.env['RESOURCES_FOLDER'] + 'config.lal',
            JSON.stringify(settings.value, null, 4)
        );
    }

    function setPassword(password: string) {
        const salt = bcrypt.genSaltSync(10);
        settings.value.password = bcrypt.hashSync(password, salt);
        settings.value.isEncrypted = true;
        saveSettings();
    }

    function changePassword(oldPassword: string, password: string) {
        if (bcrypt.compareSync(oldPassword, settings.value.password ?? '')) {
            setPassword(password);
        } else {
            throw new Error('Mot de passe incorrect');
        }
    }

    function setLeaguePath(path: string) {
        settings.value.leagueExecutable = path;
        process.env['LEAGUE_EXECUTABLE'] = path;
        saveSettings();
    }

    function checkPassword(password: string) {
        if (!bcrypt.compareSync(password, settings.value.password ?? '')) {
            throw new Error('Mot de passe incorrect');
        }
        return true;
    }

    function deletePassword(password: string) {
        if (!bcrypt.compareSync(password, settings.value.password ?? '')) {
            throw new Error('Mot de passe incorrect');
        }
        settings.value.password = '';
        settings.value.isEncrypted = false;
        saveSettings();
    }

    return {
        settings,
        loadSettings,
        changePassword,
        setPassword,
        deletePassword,
        checkPassword,
        setLeaguePath,
    };
});
