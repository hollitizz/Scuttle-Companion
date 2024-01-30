import { defineStore } from 'pinia';
import { ref } from 'vue';
import https from 'https';
import fs from 'fs';

export const useLcuStore = defineStore('useLcuStore', () => {
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

    function refreshLockfile() {
        if (
            !process.env['LEAGUE_LOCKFILE'] ||
            !fs.existsSync(process.env['LEAGUE_LOCKFILE'])
        )
            return;
        console.log('refreshLockfile', process.env['LEAGUE_LOCKFILE']);
        if (fs.existsSync(process.env['LEAGUE_LOCKFILE'])) {
            const file = fs
                .readFileSync(process.env['LEAGUE_LOCKFILE'], 'utf-8')
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

    async function lcuFetch<T>(
        endpoint: string,
        params: Record<string, any> = {}
    ): Promise<T | any> {
        refreshLockfile();
        if (!lockfile.value)
            return {
                success: false,
                message:
                    'Le launcheur league of legends ne semble pas être lancé'
            };
        const query = new URLSearchParams(params.query || {});
        const url =
            (endpoint.startsWith('/')
                ? `${baseUrl.value}${endpoint}`
                : endpoint) + query.toString();
        const body = params.body ? JSON.stringify(params.body) : undefined;
        delete params.query;
        delete params.body;
        const response = await fetch(url, {
            method: params.method ?? 'GET',
            // @ts-ignore
            agent: httpsAgent,
            headers: {
                'Content-Type': 'application/json',
                authorization: `Basic ${btoa(
                    auth.value?.username + ':' + auth.value?.password
                )}`,
                ...params.headers
            },
            body,
            ...params
        });
        if (response.status === 200)
            return { success: true, message: '', data: await response.json() };
        if (response.status === 400)
            return {
                success: false,
                message: 'Une erreur est survenue',
                data: null
            };
        if (response.status === 401)
            return {
                success: false,
                message: 'Une erreur est survenue',
                data: null
            };
        if (response.status === 404)
            return {
                success: false,
                message: 'Une erreur est survenue',
                data: null
            };
    }

    async function getSummonerRankedStats(): Promise<{
        success: boolean;
        message: string;
        data: RankedStats | null;
    }> {
        const res = await lcuFetch('/lol-ranked/v1/current-ranked-stats');
        const soloQStats = res.data.queues.find(
            (queue: any) => queue.queueType === 'RANKED_SOLO_5x5'
        );

        return {
            success: res.success,
            message: res.message,
            data: {
                tier: soloQStats.tier,
                division: soloQStats.division,
                leaguePoints: soloQStats.leaguePoints,
                miniSeriesProgress: soloQStats.miniSeriesProgress,
                isProvisional: soloQStats.isProvisional,
                wins: soloQStats.wins,
                losses: soloQStats.losses,
            }
        };
    }

    return { getSummonerRankedStats };
});
