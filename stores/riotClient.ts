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
        return `${lockfile.value.protocol}://127.0.0.1:${lockfile.value.port}`;
    });
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });

    async function getLockfileContent() {
        if (!process.env['RIOT_LOCKFILE']) return null;
        console.log('Writing lockfile');
        const file = fs
            .readFileSync(process.env['RIOT_LOCKFILE'], 'utf-8')
            .split(':');
        return {
            name: file[0],
            pid: parseInt(file[1]),
            port: parseInt(file[2]),
            password: file[3],
            protocol: file[4]
        };
    }

    async function request(
        route: string,
        method: string,
        payload: any = undefined
    ) {
        if (!baseUrl.value) return;
        const endpoint = `${baseUrl.value}${route}`;
        const response = await fetch(endpoint, {
            method,
            body: payload ? JSON.stringify(payload) : payload,
            // @ts-ignore
            agent: httpsAgent,
            headers: {
                'Content-Type': 'application/json',
                authorization: `Basic ${btoa(
                    auth.value?.username + ':' + auth.value?.password
                )}`
            },
            timeout: 5000
        });
        return response;
    }

    async function openLeagueAndWait() {
        if (!process.env['RIOT_LOCKFILE']) return;
        lockfile.value = null;

        const hasError = !useOpenGame('League of Legends');
        if (hasError) return false;
        let retry = 0;
        while (true) {
            await useSleep(500);
            retry++;
            if (retry > 60) return false;

            if (!fs.existsSync(process.env['RIOT_LOCKFILE'])) continue;
            lockfile.value = await getLockfileContent();
            if (!lockfile.value?.pid) continue;
            const response = await request(
                '/app-command/v1/auth/status',
                'GET'
            );
            if (response?.status === 200) break;
        }
        console.log('League of Legends is open');
        return true;
    }

    async function refreshLockfile() {
        if (!process.env['RIOT_LOCKFILE']) return false;
        return await openLeagueAndWait();
    }

    async function login(
        username: string,
        password: string,
        persistLogin = false
    ): Promise<{ success: boolean; message: string }> {
        const hasError = !(await refreshLockfile());
        if (hasError)
            return {
                success: false,
                message: 'Impossible de lancer le client Riot'
            };
        const response = await request(
            '/rso-auth/v1/session/credentials',
            'PUT',
            {
                username,
                password,
                persistLogin: undefined
            }
        );
        if (response) {
            if (response.status === 201)
                return { success: true, message: 'Vous êtes connecté' };
            if (response.status === 400)
                return {
                    success: false,
                    message: 'Un compte est déjà connecté'
                };
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
        }
        return {
            success: false,
            message: 'Impossible de se connecter au client Riot'
        };
    }

    return {
        login
    };
});
