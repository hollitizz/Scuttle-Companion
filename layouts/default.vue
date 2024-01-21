<template>
    <header class="flex justify-between">
        <div class="icon flex-center py-1">
            <img src="@/assets/icon.png" alt="logo" />
        </div>
        <div class="flex items-center gap-1 relative">
            <div class="hover:bg-white hover:bg-opacity-10 h-full flex-center">
                <SvgDash class="h-8 w-8" @click="minimize" />
            </div>
            <div class="hover:bg-white hover:bg-opacity-10 h-full flex-center">
                <SvgSquare class="h-8 w-8" @click="maximize" />
            </div>
            <div class="hover:bg-red h-full flex-center w-10">
                <SvgCross class="h-8 w-8" @click="close" />
            </div>
        </div>
    </header>
    <main class="flex-1 flex">
        <nav class="h-full">
            <ul>
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
            <UiSeparator class="px-2" />
            <ul>
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
            </ul>
        </nav>
        <div class="flex-1 h-[calc(100vh-2rem)]">
            <slot />
        </div>
    </main>
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

    const product =
        game === 'League of Legends' ? 'league_of_legends' : 'valorant';

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
    height: fit-content;
    -webkit-app-region: drag;

    .icon {
        width: 3.75rem;
        height: 100%;
        img {
            margin: auto;
            height: 2rem;
            width: 2rem;
        }
    }

    & > * {
        -webkit-app-region: no-drag;
    }

    border-bottom: 2px solid var(--primary);
}
main {
    nav {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-right: 2px solid var(--primary);
        gap: 0.625rem;

        ul {
            li {
                padding: 0 0.625rem;

                svg {
                    width: 2.5rem;
                    height: 2.5rem;
                }
                // &:hover {
                //     background-color: rgba(255, 255, 255, 0.1);
                // }
                // &.on {
                //     background-color: rgba(255, 255, 255, 0.05);
                // }
            }
        }
    }
}
</style>
