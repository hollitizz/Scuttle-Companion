<template>
    <VTooltip :distance="-20">
        <UiCardCircle class="select-none w-40 h-40">
            <img :src="tierImg" :alt="tier" />
        </UiCardCircle>
        <template #popper>
            <div class="text-center m-auto">
                <p class="m-0 select-none">{{ tier + rank }}</p>
                <p v-if="account.tier > 0" class="m-0 select-none">
                    {{ account.lp }} LP
                </p>
                <p
                    v-if="account.wins || account.losses"
                    class="m-0 select-none"
                >
                    {{
                        `${account.is_provisional ? '[P] ' : ''}${
                            account.wins
                        }V ${account.losses}D`
                    }}
                </p>
            </div>
        </template>
    </VTooltip>
</template>

<script lang="ts" setup>
import { Tooltip as VTooltip } from 'floating-vue';

import ChallengerImg from '@/assets/rank/10.png';
import GrandmasterImg from '@/assets/rank/9.png';
import MasterImg from '@/assets/rank/8.png';
import DiamondImg from '@/assets/rank/7.png';
import EmeraldImg from '@/assets/rank/6.png';
import PlatinumImg from '@/assets/rank/5.png';
import GoldImg from '@/assets/rank/4.png';
import SilverImg from '@/assets/rank/3.png';
import BronzeImg from '@/assets/rank/2.png';
import IronImg from '@/assets/rank/1.png';
import UnrankedImg from '@/assets/rank/0.png';

const props = defineProps({
    account: {
        type: Object as PropType<Account>,
        required: true
    }
});

const imgs = [
    UnrankedImg,
    IronImg,
    BronzeImg,
    SilverImg,
    GoldImg,
    PlatinumImg,
    EmeraldImg,
    DiamondImg,
    MasterImg,
    GrandmasterImg,
    ChallengerImg
];

const correspondingTier = [
    'Unranked',
    'Iron',
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Emerald',
    'Diamond',
    'Master',
    'Grandmaster',
    'Challenger'
];

const correspondingRank = ['0', 'I', 'II', 'III', 'IV'];

const tier = computed(() => {
    if (!props.account.tier || props.account.tier === -1)
        return correspondingTier[0];
    return correspondingTier[props.account.tier];
});

const tierImg = computed(() => {
    if (!props.account.tier || props.account.tier === -1) return UnrankedImg;
    return imgs[props.account.tier];
});

const rank = computed(() => {
    if (!props.account.tier || props.account.tier === -1) return '';
    return !props.account.tier || props.account.tier > 6
        ? ''
        : ` ${correspondingRank[props.account.rank]}`;
});
</script>

<style lang="scss" scoped></style>
