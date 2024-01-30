import fs from 'fs';

const encryptpwd = require('encrypt-with-password');

export const useAccountsStore = defineStore('useAccountsStore', () => {
    const accounts = ref(null as Account[] | null);
    const password = ref('');
    const isEncrypted = ref(false);

    function createFile() {
        fs.writeFileSync(
            process.env['RESOURCES_FOLDER'] + 'accounts.lal',
            JSON.stringify({ accounts: [] }, null, 4)
        );
    }

    function loadAccounts() {
        if (isEncrypted.value && !password.value.length) return;

        if (!fs.existsSync(process.env['RESOURCES_FOLDER'] + 'accounts.lal'))
            createFile();

        const rawFile = fs.readFileSync(
            process.env['RESOURCES_FOLDER'] + 'accounts.lal',
            'utf8'
        );

        if (isEncrypted.value) {
            accounts.value = encryptpwd.decryptJSON(
                rawFile,
                password.value
            ).accounts;
        } else {
            accounts.value = JSON.parse(rawFile).accounts;
        }
    }

    function addAccount(account: {
        summoner_name: string;
        username: string;
        password: string;
    }) {
        accounts.value!.push({
            ...account,
            tier: 0,
            rank: 0,
            lp: 0,
            icon_id: 5610,
            is_provisional: false,
            wins: 0,
            losses: 0,
            summoner_level: 0,
            id: 0,
            champions: [],
            wallet: { rp: 0, be: 0 },
            app_id: Math.floor(Math.random() * 1000000000)
        });
        saveAccounts();
    }

    function saveAccounts() {
        if (isEncrypted.value && !password.value) return;
        if (isEncrypted.value) {
            fs.writeFileSync(
                process.env['RESOURCES_FOLDER'] + 'accounts.lal',
                encryptpwd.encryptJSON(
                    { accounts: accounts.value },
                    password.value
                )
            );
        } else {
            fs.writeFileSync(
                process.env['RESOURCES_FOLDER'] + 'accounts.lal',
                JSON.stringify({ accounts: accounts.value }, null, 4)
            );
        }
    }

    return {
        accounts,
        password,
        isEncrypted,

        loadAccounts,
        addAccount,
        saveAccounts
    };
});
