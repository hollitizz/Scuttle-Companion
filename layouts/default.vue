<template>
    <header class="flex justify-between">
        <div class="icon flex-center py-1" @dblclick="close">
            <img src="@/assets/icon.png" alt="logo" />
        </div>
        <div class="flex items-center gap-1 relative">
            <div
                class="hover:bg-white hover:bg-opacity-10 h-full flex-center"
                @click="minimize"
            >
                <SvgDash class="h-8 w-8" />
            </div>
            <div
                class="hover:bg-white hover:bg-opacity-10 h-full flex-center"
                @click="maximize"
            >
                <SvgSquare class="h-8 w-8" />
            </div>
            <div class="hover:bg-red h-full flex-center w-10" @click="close">
                <SvgCross class="h-8 w-8" />
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
                >
                    <nuxt-link class="cursor-pointer" to="/">
                        <SvgDrag
                            :color="
                                $route.path === '/'
                                    ? 'var(--secondary)'
                                    : undefined
                            "
                        />
                    </nuxt-link>
                </li>
                <li v-tooltip="{ content: 'Paramètres', placement: 'right' }">
                    <nuxt-link class="cursor-pointer" to="/settings">
                        <SvgSettings
                            :color="
                                $route.path === '/settings'
                                    ? 'var(--secondary)'
                                    : undefined
                            "
                        />
                    </nuxt-link>
                </li>
            </ul>
            <UiSeparator class="px-2" />
            <ul>
                <li
                    class="cursor-pointer"
                    v-tooltip="{
                        content: 'Lancer League of Legends',
                        placement: 'right'
                    }"
                    @click="useOpenGame('League of Legends')"
                >
                    <SvgLeague />
                </li>
                <li
                    class="cursor-pointer"
                    v-tooltip="{
                        content: 'Lancer Valorant',
                        placement: 'right'
                    }"
                    @click="useOpenGame('Valorant')"
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

function minimize() {
    ipcRenderer.send('minimize');
}

function maximize() {
    ipcRenderer.send('maximize');
}

function close() {
    ipcRenderer.send('close');
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
        justify-content: flex-start;
        border-right: 2px solid var(--primary);
        list-style: none;
        ul {
            li {
                svg {
                    margin: 0.625rem;
                    width: 2.5rem;
                    height: 2.5rem;
                }
            }
        }
    }
}
</style>
