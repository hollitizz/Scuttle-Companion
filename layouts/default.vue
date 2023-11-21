<template>
    <!-- <header class="flex justify-between">
        <img class="p-0.5 pl-1" src="@/assets/icon.png" alt="logo" />
        <div class="flex items-center gap-1 relative">
            <SvgDash
                class="h-full py-1 hover:bg-white hover:bg-opacity-10"
                @click="minimize"
            />
            <SvgSquare
                class="h-full py-1 hover:bg-white hover:bg-opacity-10"
                @click="maximize"
            />
            <SvgCross class="h-full p-1 hover:bg-red" @click="close" />
        </div>
    </header>
    <main class="flex-1 flex">
        <nav class="h-full flex flex-col gap-[3px]">
            <ul class="rounded-r">
                <li
                    v-tooltip="{
                        content: 'Revenir à la liste les comptes',
                        placement: 'right'
                    }"
                    :class="{
                        on: $route.path === '/'
                    }"
                >
                    <nuxt-link tag="li" to="/">
                        <SvgDrag />
                    </nuxt-link>
                </li>
            </ul>
            <ul class="flex-1 rounded-tr">
                <li
                    v-tooltip="{
                        content: 'Lancer League of Legends',
                        placement: 'right'
                    }"
                    @click="openGame('League of Legends')"
                >
                    <SvgLeague />
                </li>
                <li
                    v-tooltip="{
                        content: 'Lancer Valorant',
                        placement: 'right'
                    }"
                    @click="openGame('Valorant')"
                >
                    <SvgValorant class="w-8 h-8" />
                </li>
                <li
                    v-tooltip="{ content: 'Paramètres', placement: 'right' }"
                    :class="{
                        on: $route.path === '/settings'
                    }"
                >
                    <nuxt-link to="/settings">
                        <SvgSettings />
                    </nuxt-link>
                </li>
            </ul>
        </nav>
        <div class="flex-1 h-[calc(100vh-2rem)]">
            <slot />
        </div>
    </main> -->
</template>

<script lang="ts" setup>
import { ipcRenderer } from 'electron';
import { spawn } from 'child_process';

function minimize() {
    ipcRenderer.send('minimize');
}

function maximize() {
    ipcRenderer.send('maximize');
}

function close() {
    ipcRenderer.send('close');
}

function openGame(game: 'League of Legends' | 'Valorant') {
    if (!process.env['LEAGUE_EXECUTABLE']) {
        return useToast.error(
            `Impossible de lancer ${game} car le chemin d'accès n'est pas valide`
        );
    }

    const product = game === 'League of Legends'? 'league_of_legends' : 'valorant';

    try {
        if (process.platform === 'win32') {
            spawn('cmd.exe', [
                '/c',
                'start',
                '""',
                process.env['LEAGUE_EXECUTABLE'],
                `--launch-product=${product}`,
                '--launch-patchline=live'
            ]);
        } else if (process.platform === 'darwin') {
            spawn('open', [process.env['LEAGUE_EXECUTABLE']]);
        }
        useToast.success(`${game} lancé !`);
    } catch (e) {
        useToast.error(`Impossible de lancer ${game}`);
    }
}
</script>

<style lang="scss" scoped>
header {
    position: relative;
    padding: 0px;
    height: 2rem;
    -webkit-app-region: drag;

    img {
        height: 100%;
    }

    & > * {
        -webkit-app-region: no-drag;
    }

    background-color: var(--primary);
}
main {
    nav {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 3rem;
        margin-top: 3px;
        border-radius: 0 0.2rem 0 0;
        ul {
            background-color: var(--primary);
            list-style: none;
            padding: 0px;
            margin: 0px;

            li {
                padding: 0.5rem;

                &:hover {
                    border-radius: 0.2rem;
                    background-color: rgba(255, 255, 255, 0.1);
                }
                &.on {
                    border-radius: 0.2rem;
                    background-color: rgba(255, 255, 255, 0.05);
                }
            }
        }
    }
}
</style>
