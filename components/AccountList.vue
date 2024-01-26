<template>
    <div class="flex w-full h-full relative py-4 flex-end">
        <AccountAddModal v-model:isOpen="isOpen" />
        <ul
            class="h-full w-4/5 gap-4 flex flex-col items-center ml-12 overflow-y-auto"
        >
            <template v-for="account in accounts" :key="account.id">
                <UiCard
                    class="w-full h-[12.5rem]"
                    borderColor="linear-gradient(165deg, var(--accent) 0%, #343434 55%)"
                    style="--card-padding: 0.625rem 0"
                >
                    <Account :account="account" />
                </UiCard>
            </template>
        </ul>
        <ul class="mx-auto mt-4">
            <li>
                <UiFormButton>
                    <SvgAdd @click="isOpen = true" />
                </UiFormButton>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { useAccountsStore } from '~/store/accounts';
import { storeToRefs } from 'pinia';
import { useLcuStore } from '~/store/lcu';

const accountsStore = useAccountsStore();
const { accounts } = storeToRefs(accountsStore);
const lcuStore = useLcuStore();

const isOpen = ref(false);
</script>

<style lang="scss" scoped></style>
