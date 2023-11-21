import { defineStore } from 'pinia';
import fs from 'fs';
import https from 'https';

export const useRiotClientStore = defineStore('useRiotClientStore', () => {
    const lockfile = ref(null as Lockfile | null);
    const auth = computed(() => {
        if (!lockfile.value) return null;
        return {
            username: 'riot',
            password: lockfile.value?.password
        };
    });
    const baseUrl = computed(() => {
        if (!lockfile.value) return null;
        return `${lockfile.value.protocol}://localhost:${lockfile.value.port}`;
    });
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });

    function refreshLockfile() {
        if (
            !process.env['RIOT_LOCKFILE'] ||
            !fs.existsSync(process.env['RIOT_LOCKFILE'])
        )
            return;
        if (fs.existsSync(process.env['RIOT_LOCKFILE'])) {
            const file = fs
                .readFileSync(process.env['RIOT_LOCKFILE'], 'utf-8')
                .split(':');
            lockfile.value = {
                name: file[0],
                pid: parseInt(file[1]),
                port: parseInt(file[2]),
                password: file[3],
                protocol: file[4]
            };
        }
    }

    async function login(
        username: string,
        password: string,
        persistLogin = false
    ): Promise<{ success: boolean; message: string }> {
        refreshLockfile();
        if (!lockfile.value)
            return {
                success: false,
                message: 'Le client riot ne semble pas être lancé'
            };

        const endpoint = `${baseUrl.value}/rso-auth/v1/session/credentials`;
        const payload = {
            username,
            password,
            persistLogin
        };
        const response = await fetch(endpoint, {
            method: 'PUT',
            body: JSON.stringify(payload),
            // @ts-ignore
            agent: httpsAgent,
            headers: {
                'Content-Type': 'application/json',
                authorization: `Basic ${btoa(
                    auth.value?.username + ':' + auth.value?.password
                )}`
            }
        });
        if (response.status === 201)
            return { success: true, message: 'Vous êtes connecté' };
        if (response.status === 400)
            return { success: false, message: 'Un compte est déjà connecté' };
        if (response.status === 401)
            return {
                success: false,
                message: "Nom d'utilisateur ou mot de passe incorrect"
            };
        if (response.status === 404) {
            lockfile.value = null;
            return {
                success: false,
                message: 'Le client riot ne semble pas être lancé'
            };
        }
        return {
            success: false,
            message: 'Une erreur est survenue'
        };
    }

    return {
        login
    };
});
