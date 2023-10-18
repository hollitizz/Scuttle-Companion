import { defineStore } from 'pinia';
import { ref } from 'vue';
import { LeagueSettings, Settings } from '../types';
import fs from 'fs';
import bcrypt from 'bcryptjs';

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref({} as Settings);

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
        if (!settings.value.leagueSettings)
            settings.value.leagueSettings = {} as LeagueSettings;

        if (settings.value.leagueExecutable && settings.value.leagueExecutable !== "")
            process.env['LEAGUE_EXECUTABLE'] = settings.value.leagueExecutable;
        else {
            if (
                fs.existsSync(
                    `${process.env.SystemDrive}/Riot Games/Riot Client/RiotClientServices.exe`
                )
            ) {
                process.env[
                    'LEAGUE_EXECUTABLE'
                ] = `${process.env.SystemDrive}/Riot Games/Riot Client/RiotClientServices.exe`;
                settings.value.leagueExecutable =
                    process.env['LEAGUE_EXECUTABLE'];
                setLeaguePath(process.env['LEAGUE_EXECUTABLE']);
            } else {
                process.env['LEAGUE_EXECUTABLE'] = '';
                settings.value.leagueExecutable = '';
            }
        }

        if (settings.value.leagueLockfile && settings.value.leagueLockfile !== "") {
            process.env['LEAGUE_LOCKFILE'] = settings.value.leagueLockfile;
        } else {
            if (
                fs.existsSync(
                    `${process.env['SystemDrive']}/Riot Games/League of Legends`
                )
            ) {
                process.env[
                    'LEAGUE_LOCKFILE'
                ] = `${process.env['SystemDrive']}/Riot Games/League of Legends`;
                settings.value.leagueLockfile = process.env['LEAGUE_LOCKFILE'];
                setLeagueLockPath(process.env['LEAGUE_LOCKFILE']);
            } else {
                process.env['LEAGUE_LOCKFILE'] = '';
                settings.value.leagueLockfile = '';
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

    function setLeagueLockPath(path: string) {
        settings.value.leagueLockfile = path;
        process.env['LEAGUE_LOCKFILE'] = path;
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

    function setLeagueSettings(leagueSettings: LeagueSettings) {
        settings.value.leagueSettings = leagueSettings;
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
        setLeagueLockPath,
        setLeagueSettings
    };
});
