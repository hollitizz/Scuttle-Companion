<template>
    <div
        class="flex w-full h-full relative py-4 px-2 flex-start overflow-y-auto"
    >
        <AccountAddModal v-model:isOpen="isOpen" />
        <ul class="h-fit w-4/5 gap-4 flex flex-col items-center ml-12">
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
        <ul class="mx-auto mt-4 top-4 right-0 sticky">
            <li>
                <UiFormButton
                    v-tooltip="'Ajouter un compte'"
                    @click="isOpen = true"
                    :small="true"
                >
                    <SvgAdd class="w-6 h-6" />
                </UiFormButton>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
const accountsStore = useAccountsStore();
const { accounts } = storeToRefs(accountsStore);

const isOpen = ref(false);
</script>

<style lang="scss" scoped></style>
