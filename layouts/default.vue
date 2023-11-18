<template>
    <header class="flex">
        <img class="p-0.5 pl-1" src="@/assets/icon.png" alt="logo" />
        <div class="ml-auto flex items-center gap-1 relative">
            <SvgDash class="h-full py-1 hover:bg-white hover:bg-opacity-10" />
            <SvgSquare class="h-full py-1 hover:bg-white hover:bg-opacity-10" />
            <SvgCross class="h-full p-1 hover:bg-red" />
        </div>
    </header>
    <main class="flex-1 flex">
        <nav class="h-full flex flex-col gap-[3px]">
            <ul class="rounded-r">
                <li v-tooltip="'Revenir à la liste les comptes'">
                    <nuxt-link tag="li" to="/">
                        <SvgDrag />
                    </nuxt-link>
                </li>
            </ul>
            <ul class="flex-1 rounded-tr">
                <li v-tooltip="'Lancer League of Legends'">
                    <SvgLeague />
                </li>
                <li v-tooltip="'Lancer Valorant'">
                    <SvgValorant class="w-8 h-8" />
                </li>
                <li v-tooltip="'Paramètres'">
                    <nuxt-link to="/settings">
                        <SvgSettings />
                    </nuxt-link>
                </li>
            </ul>
        </nav>
        <slot />
    </main>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
header {
    position: relative;
    padding: 0px;
    height: 2rem;

    img {
        height: 100%;
    }
    background-color: rgba(0, 0, 0, 0.15);
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
            background-color: rgba(0, 0, 0, 0.15);
            list-style: none;
            padding: 0px;
            margin: 0px;
            li {
                padding: 0.5rem;
            }
        }
    }
}
</style>
