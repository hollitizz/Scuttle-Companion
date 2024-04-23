import { defineStore } from 'pinia';
import { ref } from 'vue';
import https from 'https';
import fs from 'fs';
import { ipcRenderer } from 'electron';

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

    async function lcuFetch<T = any>(
        endpoint: string,
        params: Record<string, any> = {}
    ): Promise<{ success: boolean; message: string; data?: T }> {
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
            return {
                success: true,
                message: '',
                data: (await response.json()) as T
            };
        if (response.status === 400)
            return {
                success: false,
                message: `Error ${response.status}: Une erreur est survenue`
            };
        if (response.status === 401)
            return {
                success: false,
                message: `Error ${response.status}: Une erreur est survenue`
            };
        if (response.status === 404)
            return {
                success: false,
                message: `Error ${response.status}: Une erreur est survenue`
            };

        return {
            success: false,
            message: `Error ${response.status}: Une erreur est survenue`
        };
    }

    async function getSummonerRankedStats() {
        const res = await lcuFetch<LolRankedV1CurrentRankedStats>(
            '/lol-ranked/v1/current-ranked-stats'
        );

        return res;
    }

    async function getConnectedAccountInfo() {
        const res = await lcuFetch<LolSummonerV1CurrentSummoner>(
            '/lol-summoner/v1/current-summoner'
        );

        return res;
    }

    async function downloadChampTile(url: string, savePath: string) {
        const res = await fetch(url, {
            // @ts-ignore
            agent: httpsAgent,
            headers: {
                'Content-Type': 'application/json',
                authorization: `Basic ${btoa(
                    auth.value?.username + ':' + auth.value?.password
                )}`
            }
        });
        const blob = await res.arrayBuffer();
        const buffer = Buffer.from(blob);
        fs.writeFileSync(savePath, buffer);
        return savePath;
    }

    async function getChampList() {
        const res = await lcuFetch<LolChampionsV1OwnedChampionsMinimal[]>(
            '/lol-champions/v1/owned-champions-minimal'
        );
        if (!res.success || !res.data) return null;

        return res.data.reduce((acc: string[], cur: any) => {
            if (!cur.ownership.owned) return acc;
            acc.push(cur.name);
            if (
                !fs.existsSync(
                    `${process.env['RESOURCES_FOLDER']}championTiles`
                )
            )
                fs.mkdirSync(`${process.env['RESOURCES_FOLDER']}championTiles`);
            if (
                !fs.existsSync(
                    `${process.env['RESOURCES_FOLDER']}championTiles/${cur.name}.png`
                )
            ) {
                if (cur.alias === 'FiddleSticks') cur.alias = 'Fiddlesticks';
                downloadChampTile(
                    `${baseUrl.value}${cur.squarePortraitPath}`,
                    `${process.env['RESOURCES_FOLDER']}championTiles/${cur.name}.png`
                );
            }
            return acc;
        }, [] as string[]);
    }

    return { getSummonerRankedStats, getConnectedAccountInfo, getChampList };
});
