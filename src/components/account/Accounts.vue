<template>
    <ul class="account-list" @dragenter.prevent @dragleave.prevent :key="len">
        <li
            v-for="(account, index) in accounts"
            :key="index"
            class="list-element"
            :class="{ draggable: isEditMode }"
            :draggable="isEditMode"
            @dragstart="dragStart"
            @dragover="dragOver"
            @dragend="dragEnd"
            @dragenter.prevent
            @dragleave.prevent
        >
            <UiCardsRectangle
                class="card-element"
                :class="{ clickable: isEditMode }"
            >
                <AccountAccount
                    @delete:account="handleDeleteAccount"
                    @login:success="updateAccount"
                    @update:account="updateAccount"
                    :isEditMode="isEditMode"
                    :account="account"
                />
            </UiCardsRectangle>
        </li>
    </ul>
</template>
<script setup lang="ts">
import { Account } from '../../types';
import AccountAccount from './Account.vue';
import UiCardsRectangle from '../ui/cards/Rectangle.vue';
import { PropType, computed, ref, watch } from 'vue';

const emits = defineEmits([
    'update:accounts',
    'delete:account',
    'update:account'
]);

const props = defineProps({
    isEditMode: {
        type: Boolean,
        required: true
    },
    accounts: {
        type: Array as PropType<Account[]>,
        required: true
    }
});

const accounts = ref(props.accounts);

watch(
    () => props.accounts,
    () => {
        accounts.value = props.accounts;
    }
);

const itemList = ref(null as HTMLUListElement | null);
const items = ref(null as NodeListOf<HTMLLIElement> | null);
const startIndex = ref(null as number | null);
const currentIndex = ref(null as number | null);
const draggingItem = ref(null as HTMLLIElement | null);

const len = computed(() => accounts.value.length);

function handleDeleteAccount(account: Account) {
    emits('delete:account', account);
}

async function updateAccount(from: Account, to: Account) {
    emits('update:account', from, to);
}

function dragStart(event: DragEvent) {
    if (!props.isEditMode) {
        event.preventDefault();
        return;
    }
    itemList.value = document.querySelector('.account-list');
    items.value = document.querySelectorAll('.list-element');
    const target = event.target as EventTarget;
    if (event.target === null) return;
    // @ts-ignore
    setTimeout(() => target.classList.add('dragging'), 0);
    draggingItem.value = target as HTMLLIElement;
    if (items.value === null) return;
    for (let i = 0; i < items.value.length; i++) {
        if (items.value[i] === target) {
            startIndex.value = i;
            break;
        }
    }
}

function dragEnd(event: DragEvent) {
    event.preventDefault();
    if (!props.isEditMode) return;
    const target = event.target;
    if (target === null) return;
    emits('update:accounts', startIndex.value, currentIndex.value);
    // @ts-ignore
    target.classList.remove('dragging');
}

function dragOver(event: DragEvent) {
    event.preventDefault();
    if (itemList.value === null) return;
    const siblings = [
        // @ts-ignore
        ...itemList.value.querySelectorAll('.list-element:not(.dragging)')
    ];
    const list = document.getElementsByClassName('account-list')[0];
    if (list === undefined) return;
    const scrollY = list.scrollTop;
    const nextSibling = siblings.find(sibling => {
        return (
            event.clientY + scrollY <
            sibling.offsetTop + sibling.offsetHeight / 2
        );
    });
    currentIndex.value = siblings.findIndex(sb => sb === nextSibling);
    //@ts-ignore
    itemList.value.insertBefore(draggingItem.value, nextSibling);
}
</script>
<style lang="scss" scoped>
.list-element {
    height: 10rem;
    width: 45rem;
    padding: 0;
    margin: 1rem auto;
}
.account-list {
    width: 45rem;
    height: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
    overflow: auto;

    .card-element {
        padding: 0;
        height: 100%;
        width: 100%;
    }
    .clickable {
        &:hover {
            cursor: grab;
            background-color: rgba($color: #000, $alpha: 0.2);
        }
    }
}

.list-element {
    &.dragging :where(.card-element) {
        opacity: 0;
    }
}
</style>
