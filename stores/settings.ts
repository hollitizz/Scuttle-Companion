import fs from 'fs';
import bcrypt from 'bcryptjs';

export const useSettingsStore = defineStore('useSettingsStore', () => {
    const settings = ref(null as Settings | null);

    function loadDefaultConfig() {
        fs.writeFileSync(
            process.env['RESOURCES_FOLDER'] + 'config.lal',
            JSON.stringify(
                {
                    isEncrypted: false,
                    password: '',
                    leagueSettings: {},
                    leagueExecutable: '',
                    leagueLockfile: ''
                },
                null,
                4
            )
        );
    }

    function setMissingSettings() {
        if (!settings.value) return loadDefaultConfig();
        if (settings.value.isEncrypted === undefined)
            settings.value.isEncrypted = false;
        if (settings.value.password === undefined) settings.value.password = '';
        if (!settings.value.leagueSettings) settings.value.leagueSettings = {};
        if (!settings.value.leagueExecutable)
            settings.value.leagueExecutable = '';
        if (!settings.value.leagueLockfile) settings.value.leagueLockfile = '';
        saveSettings();
    }

    function saveSettings() {
        fs.writeFileSync(
            process.env['RESOURCES_FOLDER'] + 'config.lal',
            JSON.stringify(settings.value, null, 4)
        );
    }

    function setLeaguePath(path: string) {
        settings.value!.leagueExecutable = path;
        process.env['LEAGUE_EXECUTABLE'] = path;
        saveSettings();
    }

    function setLockfilePath(path: string) {
        settings.value!.leagueLockfile = path + '/lockfile';
        process.env['LEAGUE_LOCKFILE'] = path + '/lockfile';
        saveSettings();
    }

    function setPaths() {
        if (!settings.value) return loadDefaultConfig();
        if (
            settings.value.leagueExecutable !== '' &&
            fs.existsSync(settings.value.leagueExecutable)
        ) {
            process.env['LEAGUE_EXECUTABLE'] = settings.value.leagueExecutable;
        } else {
            setLeaguePath(
                fs.existsSync(`${process.env['DEFAULT_LEAGUE_EXECUTABLE']}`)
                    ? `${process.env['DEFAULT_LEAGUE_EXECUTABLE']}`
                    : ''
            );
        }

        if (
            settings.value.leagueLockfile !== '' &&
            fs.existsSync(settings.value.leagueLockfile)
        ) {
            process.env['LEAGUE_LOCKFILE'] =
                settings.value.leagueLockfile + '/lockfile';
        } else {
            setLockfilePath(
                fs.existsSync(`${process.env['DEFAULT_LEAGUE_LOCKFILE']}`)
                    ? `${process.env['DEFAULT_LEAGUE_LOCKFILE']}`
                    : ''
            );
        }
    }

    function loadSettings() {
        if (!fs.existsSync(process.env['RESOURCES_FOLDER'] + 'config.lal'))
            loadDefaultConfig();
        settings.value = JSON.parse(
            fs.readFileSync(
                process.env['RESOURCES_FOLDER'] + 'config.lal',
                'utf8'
            )
        );

        if (
            settings.value &&
            (settings.value.isEncrypted === undefined ||
                settings.value.password === undefined ||
                settings.value.leagueSettings === undefined ||
                settings.value.leagueExecutable === undefined ||
                settings.value.leagueLockfile === undefined)
        ) {
            setMissingSettings();
            loadSettings();
        }

        return setPaths();
    }
    function setPassword(password: string) {
        if (!settings.value) loadSettings();
        if (!settings.value) return new Error('No settings found');

        const salt = bcrypt.genSaltSync(10);
        settings.value.password = bcrypt.hashSync(password, salt);
        settings.value.isEncrypted = true;
        saveSettings();
    }

    function changePassword(oldPassword: string, password: string) {
        if (!settings.value) loadSettings();
        if (!settings.value) return new Error('No settings found');

        if (bcrypt.compareSync(oldPassword, settings.value.password ?? '')) {
            setPassword(password);
        } else {
            return new Error('Mot de passe incorrect');
        }
    }
    function checkPassword(password: string) {
        if (!bcrypt.compareSync(password, settings.value?.password ?? '')) {
            return new Error('Mot de passe incorrect');
        }
        return true;
    }

    function deletePassword(password: string) {
        if (!settings.value) loadSettings();
        if (!settings.value) return new Error('No settings found');

        if (!bcrypt.compareSync(password, settings.value.password ?? '')) {
            return new Error('Mot de passe incorrect');
        }
        settings.value.password = '';
        settings.value.isEncrypted = false;
        saveSettings();
    }

    function setLeagueSettings(leagueSettings: LeagueSettings) {
        if (!settings.value) loadSettings();
        if (!settings.value) return new Error('No settings found');

        settings.value.leagueSettings = leagueSettings;
        saveSettings();
    }

    return {
        settings,

        loadSettings,

        setPassword,
        changePassword,
        deletePassword,
        checkPassword,

        setLeaguePath,
        setLockfilePath,

        setLeagueSettings
    };
});
