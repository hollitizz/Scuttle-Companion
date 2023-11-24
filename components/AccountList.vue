<template>
    <div class="flex w-full h-full relative py-4 flex-end ">
        <AccountAddModal v-model:isOpen="isOpen" />
        <ul
            class="h-full w-4/5 gap-4 flex flex-col items-center ml-auto overflow-y-auto"
        >
            <template v-for="account in accounts" :key="account.id">
                <li class="bg-card-color w-full rounded-xl">
                    <Account :account="account" />
                </li>
            </template>
        </ul>
        <ul class=" mx-8 mt-4">
            <li>
                <UiFormButton>
                    <SvgAdd @click="isOpen = true " />
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

const isOpen = ref(true);


</script>

<style lang="scss" scoped></style>
