<template>
    <header class="flex justify-between">
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
                >
                    <SvgLeague />
                </li>
                <li
                    v-tooltip="{
                        content: 'Lancer Valorant',
                        placement: 'right'
                    }"
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
        <div class="flex-1">
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
