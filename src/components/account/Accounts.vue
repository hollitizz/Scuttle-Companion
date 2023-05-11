<template>
    <ul class="account-list" @dragenter="dragEnter">
        <li
            v-for="(account, index) in accounts"
            class="list-element"
            :draggable="isEditMode"
            @dragstart="dragStart($event, index)"
            @dragover="dragOver($event, index)"
            @dragend="dragEnd($event, index)"
            @dragenter.prevent
            @dragleave.prevent
            @drop.prevent
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
import { PropType, ref, onMounted } from 'vue';

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
const itemList = ref(null as HTMLUListElement | null);
const items = ref(null as NodeListOf<HTMLLIElement> | null);
const startIndex = ref(null as number | null);
const currentIndex = ref(null as number | null);
const draggingItem = ref(null as HTMLLIElement | null);

function handleDeleteAccount(account: Account) {
    emits('delete:account', account);
}

async function updateAccount(from: Account, to: Account) {
    emits('update:account', from, to);
}

function dragStart(event: DragEvent, index: number) {
    if (!props.isEditMode) return;
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

function dragEnd(event: DragEvent, index: number) {
    event.preventDefault();
    if (!props.isEditMode) return;
    const target = event.target;
    if (target === null) return;
    emits('update:accounts', startIndex.value, currentIndex.value);
    // @ts-ignore
    target.classList.remove('dragging');
}

function dragEnter(event: DragEvent) {
    event.preventDefault();
}

function dragOver(event: DragEvent, index: number) {
    event.preventDefault();
    if (itemList.value === null) return;
    const siblings = [
        // @ts-ignore
        ...itemList.value.querySelectorAll('.list-element:not(.dragging)')
    ];
    const nextSibling = siblings.find(
        sibling => event.clientY < sibling.offsetTop + sibling.offsetHeight / 2
    );
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
    width: 100%;
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
