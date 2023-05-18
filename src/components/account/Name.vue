<template>
    <div class="name-fields" :key="imgKey" :style="{'--color': isLogged ? 'var(--green)' : 'var(--secondary)'}">
        <div
            v-if="account.icon_id && iconExists"
            class="profileIcon select-none"
        >
            <img :src="icon" alt="icon" />
            <p class="lvl">{{ account.summoner_level }}</p>
        </div>
        <h1 class="mx-auto text-center">{{ account.summoner_name }}</h1>
    </div>
</template>
<script setup lang="ts">
import { Account } from '../../types';
import { PropType, computed, ref, watch } from 'vue';
import fs from 'fs';

const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    },
    imgKey: {
        type: Number,
        required: true
    },
    isLogged: {
        type: Boolean,
        required: true
    }
});

const icon = computed(() => {
    return `${process.env['RESOURCES_FOLDER']}profileIcons/${props.account.icon_id}.png`;
});

const imgKey = ref(props.imgKey);

watch(
    () => props.imgKey,
    () => {
        imgKey.value = props.imgKey;
    }
);

const iconExists = computed(() => {
    imgKey.value++;
    if (!props.account.icon_id) return false;
    return fs.existsSync(icon.value);
});
</script>
<style lang="scss" scoped>
.mx-auto {
    margin-left: auto;
    margin-right: auto;
}

.profileIcon {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 32px;
    outline: solid 3px var(--color);
    img {
        width: 6rem;
        height: 6rem;
        border-radius: 32px;
        margin: 0;
        z-index: 1;
    }

    .lvl {
        position: absolute;
        top: 4rem;
        text-align: center;
        background-color: var(--primary);
        padding: 0 0.5rem;
        border-radius: 0.8rem;
        border: var(--secondary) solid 0.3rem;
        z-index: 1;
    }
}

.name-fields {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    margin-top: 10px;
    h1 {
        margin: 0;
        padding: 0;
    }
}
</style>
